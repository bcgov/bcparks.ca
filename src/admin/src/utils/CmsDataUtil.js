import { cmsAxios } from "../axios_config";
import qs from "qs";

const querySort = (key) =>
    qs.stringify(
        {
            sort: [key],
        },
        {
            pagination: {
                limit: -1,
            },
            encodeValuesOnly: true,
        }
    );
export function getProtectedAreas(cmsData, setCmsData) {
    if (!cmsData.protectedAreas) {
        const result = cmsAxios.get(`/protected-areas/items`).then((res) => {
            const data = cmsData;
            data.protectedAreas = res.data;// just for info: data obj just once
            setCmsData(data);
            return res.data;
        });
        return result;
    } else {
        return cmsData.protectedAreas;
    }
}

export function getRegions(cmsData, setCmsData) {
    if (!cmsData.regions) {
        const result = cmsAxios
            .get(`/regions?${querySort("regionName")}&populate=*`)
            .then((res) => {
                const data = cmsData;
                data.regions = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.regions;
    }
}

export function getSections(cmsData, setCmsData) {
    if (!cmsData.sections) {
        const result = cmsAxios
            .get(`/sections?${querySort("sectionName")}&populate=*`)
            .then((res) => {
                const data = cmsData;
                data.sections = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.sections;
    }
}

export function getManagementAreas(cmsData, setCmsData) {
    const fields = qs.stringify({
        fields: ['id', 'managementAreaNumber', 'managementAreaName'],
        populate: {
            protectedAreas: { fields: ['id', 'protectedAreaName', 'orcs'] },
            section: { fields: ['id'] },
            region: { fields: ['id'] }
        }
    });
    if (!cmsData.managementAreas) {
        const result = cmsAxios
            .get(`/management-areas?${querySort("managementAreaName")}&${fields}`)
            .then((res) => {
                const data = cmsData;
                data.managementAreas = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.managementAreas;
    }
}

export function getSites(cmsData, setCmsData) {
    if (!cmsData.sites) {
        const result = cmsAxios
            .get(`/sites?${querySort("siteName")}&populate=*`)
            .then((res) => {
                const data = cmsData;
                data.sites = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.sites;
    }
}

export function getFireCentres(cmsData, setCmsData) {
    if (!cmsData.fireCentres) {
        const result = cmsAxios
            .get(`/fire-centres?${querySort("fireCentreName")}&populate=*`)
            .then((res) => {
                const data = cmsData;
                data.fireCentres = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.fireCentres;
    }
}

export function getFireZones(cmsData, setCmsData) {
    if (!cmsData.fireZones) {
        const result = cmsAxios
            .get(`/fire-zones?${querySort("fireZoneName")}&populate=*`)
            .then((res) => {
                const data = cmsData;
                data.fireZones = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.fireZones;
    }
}

export function getNaturalResourceDistricts(cmsData, setCmsData) {
    if (!cmsData.naturalResourceDistricts) {
        const result = cmsAxios
            .get(`/natural-resource-districts?${querySort("naturalResourceDistrictName")}&populate=*`)
            .then((res) => {
                const data = cmsData;
                data.naturalResourceDistricts = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.naturalResourceDistricts;
    }
}

export function getEventTypes(cmsData, setCmsData) {
    if (!cmsData.eventTypes) {
        const result = cmsAxios
            .get(`/event-types?${querySort("eventType")}`)
            .then((res) => {
                const data = cmsData;
                data.eventTypes = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.eventTypes;
    }
}

export function getAccessStatuses(cmsData, setCmsData) {
    if (!cmsData.accessStatuses) {
        const result = cmsAxios
            .get(`/access-statuses?${querySort("precedence")}`)
            .then((res) => {
                const data = cmsData;
                data.accessStatuses = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.accessStatuses;
    }
}

export function getUrgencies(cmsData, setCmsData) {
    if (!cmsData.urgencies) {
        const result = cmsAxios
            .get(`/urgencies?${querySort("sequence")}`)
            .then((res) => {
                const data = cmsData;
                data.urgencies = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.urgencies;
    }
}

export function getAdvisoryStatuses(cmsData, setCmsData) {
    if (!cmsData.advisoryStatuses) {
        const result = cmsAxios
            .get(`/advisory-statuses?${querySort("code")}`)
            .then((res) => {
                const data = cmsData;
                data.advisoryStatuses = res.data?.data;
                setCmsData(data);
                return res.data?.data;
            });
        return result;
    } else {
        return cmsData.advisoryStatuses;
    }
}

export function getLinkTypes(cmsData, setCmsData) {
    if (!cmsData.linkTypes) {
        const result = cmsAxios
            .get(`/link-types?${querySort("id")}`)
            .then((res) => {
                const data = cmsData;
                data.linkTypes = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.linkTypes;
    }
}

export function getBusinessHours(cmsData, setCmsData) {
    const result = cmsAxios.get(`/business-hour`).then((res) => {
        const data = cmsData;
        data.businessHours = res.data.data;// added
        setCmsData(data);
        return res.data.data;
    });
    return result;
}

export function getStandardMessages(cmsData, setCmsData) {
    if (!cmsData.standardMessages) {
        const result = cmsAxios
            .get(`/standard-messages?${querySort("precedence")}`)
            .then((res) => {
                const data = cmsData;
                data.standardMessages = res.data.data;
                setCmsData(data);
                return res.data.data;
            });
        return result;
    } else {
        return cmsData.standardMessages;
    }
}

export function getParkRelations(parkId) {
    const query = qs.stringify(
        {
            publicationState: "preview",
            fields: ["id"],
            filters: {
                id: parkId
            },
            populate: {
                managementAreas: {
                    populate: ["region", "section"]
                },
                fireZones: {
                    populate: ["fireCentre"]
                },
                sites: {
                    fields: ["id"]
                },
                naturalResourceDistricts: {
                    fields: ["id"]
                }
            }
        },
        {
            encodeValuesOnly: true
        }
    )
    const result = cmsAxios
        .get(`/protected-areas?${query}`)
        .then((res) => {
            if (res.data.data.length) {
                const parkInfo = res.data.data[0].attributes;
                const managementArea = parkInfo.managementAreas?.data[0];
                const region = managementArea?.attributes.region?.data;
                const section = managementArea?.attributes.section?.data;
                const fireZone = parkInfo.fireZones?.data[0];
                const fireCentre = fireZone?.attributes.fireCentre?.data;
                const naturalResourceDistrict = parkInfo.naturalResourceDistricts?.data[0];
                const sites = parkInfo.sites;
                return {
                    managementArea: managementArea,
                    region: region,
                    section: section,
                    fireZone: fireZone,
                    fireCentre: fireCentre,
                    naturalResourceDistrict: naturalResourceDistrict,
                    sites: sites
                };
            } else {
                return {
                    managementArea: null,
                    region: null,
                    section: null,
                    fireZone: null,
                    fireCentre: null,
                    naturalResourceDistrict: null,
                    sites: null
                };
            }
        })
        .catch((err) => { console.log(err) })
    return result;
}