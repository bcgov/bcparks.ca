import { cmsAxios } from "../axios_config";
import moment from "moment";
import qs from "qs";

const advisoryArchiveDays = 30;

export function getLatestPublicAdvisoryAudits(keycloak, showArchived) {

    let archiveDate = moment().subtract(advisoryArchiveDays, 'days').format('YYYY-MM-DD');

    let showArchivedFilter = {};

    if (!showArchived) {
        showArchivedFilter = {
            $or: [
                { advisoryStatus: { code: 'PUB' } },
                { updatedAt: { $gt: archiveDate } }
            ]
        };
    }
    const query = qs.stringify({
        fields: ['advisoryNumber', 'advisoryDate', 'title', 'effectiveDate', 'endDate', 'expiryDate', 'updatedAt'],
        populate: {
            protectedAreas: {
                fields: ['orcs', 'protectedAreaName'],
            },
            advisoryStatus: {
                fields: ['advisoryStatus', 'code'],
            },
            eventType: {
                fields: ['eventType'],
            },
            urgency: {
                fields: ['urgency'],
            },
            regions: {
                fields: ['regionName'],
            }
        },
        filters: {
            $and: [
                { isLatestRevision: true },
                showArchivedFilter
            ]
        },
        pagination: {
            limit: 2000
        },
        sort: ['advisoryDate:DESC']
    }, {
        encodeValuesOnly: true,
    });
    return cmsAxios.get(`public-advisory-audits?${query}`, {
        headers: {
            Authorization: `Bearer ${keycloak.token}`
        }
    })
}

export function updatePublicAdvisories(publicAdvisories, managementAreas) {
    const today = moment(new Date()).tz("America/Vancouver").toISOString();
    let archiveDate = moment().subtract(advisoryArchiveDays, 'days').format('YYYY-MM-DD');

    const regionParksCount = managementAreas.reduce((region, item) => {
        region[item.region?.id] = (region[item.region?.id] || 0) + item.protectedAreas?.length;
        return region;
    }, {});

    return publicAdvisories.map((publicAdvisory) => {
        publicAdvisory.expired = publicAdvisory.expiryDate < today ? "Y" : "N";
        publicAdvisory.associatedParks = publicAdvisory.protectedAreas.map((p) => p.protectedAreaName).join(", ")
            + publicAdvisory.regions.map((r) => r.regionName).join(", ");

        let regionsWithParkCount = [];
        if (publicAdvisory?.regions?.length > 0) {
            publicAdvisory.regions.forEach((region) => {
                region.count = regionParksCount[region.id];
                regionsWithParkCount = [...regionsWithParkCount, region];
            });
            publicAdvisory.regions = regionsWithParkCount;
        }

        publicAdvisory.archived = publicAdvisory.advisoryStatus.code !== 'PUB' && publicAdvisory.updatedAt < archiveDate;

        return publicAdvisory;
    });
}
