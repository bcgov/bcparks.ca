import { cmsAxios } from "../axios_config";
import moment from "moment";
import qs from "qs";

const advisoryArchiveDays = 30;
const archiveDate = moment().subtract(advisoryArchiveDays, 'days').format('YYYY-MM-DD');

export function getLatestPublicAdvisoryAudits(keycloak, showArchived) {

    let advisoryFilter = {};

    if (!showArchived) {
        advisoryFilter = {
            $or: [
                { advisoryStatus: { code: { $ne: 'INA' } } },
                { updatedAt: { $gt: archiveDate } }
            ]
        };
    } else {
        const modifiedDate = moment().subtract(18, 'months').format('YYYY-MM-DD');
        advisoryFilter = {
            updatedAt: { $gt: modifiedDate }
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
                advisoryFilter
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

        publicAdvisory.archived = publicAdvisory.advisoryStatus.code === 'INA' && publicAdvisory.updatedAt < archiveDate;

        return publicAdvisory;
    });
}
