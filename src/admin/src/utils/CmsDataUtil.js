import { cmsAxios } from "../axios_config";

export function getProtectedAreas(cmsData, setCmsData) {
  if (!cmsData.protectedAreas) {
    const result = cmsAxios
      .get(`/protected-areas/names?_limit=-1&_sort=protectedAreaName`)
      .then((res) => {
        const data = cmsData;
        data.protectedAreas = res.data;
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
      .get(`/regions?_limit=-1&_sort=regionName`)
      .then((res) => {
        const data = cmsData;
        data.regions = res.data;
        setCmsData(data);
        return res.data;
      });
    return result;
  } else {
    return cmsData.regions;
  }
}

export function getSections(cmsData, setCmsData) {
  if (!cmsData.sections) {
    const result = cmsAxios
      .get(`/sections?_limit=-1&_sort=sectionName`)
      .then((res) => {
        const data = cmsData;
        data.sections = res.data;
        setCmsData(data);
        return res.data;
      });
    return result;
  } else {
    return cmsData.sections;
  }
}

export function getManagementAreas(cmsData, setCmsData) {
  if (!cmsData.managementAreas) {
    const result = cmsAxios
      .get(`/management-areas?_limit=-1&_sort=managementAreaName`)
      .then((res) => {
        const data = cmsData;
        data.managementAreas = res.data;
        setCmsData(data);
        return res.data;
      });
    return result;
  } else {
    return cmsData.managementAreas;
  }
}

export function getSites(cmsData, setCmsData) {
  if (!cmsData.sites) {
    const result = cmsAxios
      .get(`/sites?_limit=-1&_sort=siteName`)
      .then((res) => {
        const data = cmsData;
        data.sites = res.data;
        setCmsData(data);
        return res.data;
      });
    return result;
  } else {
    return cmsData.sites;
  }
}

export function getFireCentres(cmsData, setCmsData) {
  if (!cmsData.fireCentres) {
    const result = cmsAxios
      .get(`/fire-centres?_limit=-1&_sort=fireCentreName`)
      .then((res) => {
        const data = cmsData;
        data.fireCentres = res.data;
        setCmsData(data);
        return res.data;
      });
    return result;
  } else {
    return cmsData.fireCentres;
  }
}

export function getFireZones(cmsData, setCmsData) {
  if (!cmsData.fireZones) {
    const result = cmsAxios
      .get(`/fire-zones?_limit=-1&_sort=fireZoneName`)
      .then((res) => {
        const data = cmsData;
        data.fireZones = res.data;
        setCmsData(data);
        return res.data;
      });
    return result;
  } else {
    return cmsData.fireZones;
  }
}

export function getEventTypes(cmsData, setCmsData) {
  if (!cmsData.eventTypes) {
    const result = cmsAxios
      .get(`/event-types?_limit=-1&_sort=eventType`)
      .then((res) => {
        const data = cmsData;
        data.eventTypes = res.data;
        setCmsData(data);
        return res.data;
      });
    return result;
  } else {
    return cmsData.eventTypes;
  }
}

export function getAccessStatuses(cmsData, setCmsData) {
  if (!cmsData.accessStatuses) {
    const result = cmsAxios
      .get(`/access-statuses?_limit=-1&_sort=precedence`)
      .then((res) => {
        const data = cmsData;
        data.accessStatuses = res.data;
        setCmsData(data);
        return res.data;
      });
    return result;
  } else {
    return cmsData.accessStatuses;
  }
}

export function getUrgencies(cmsData, setCmsData) {
  if (!cmsData.urgencies) {
    const result = cmsAxios
      .get(`/urgencies?_limit=-1&_sort=sequence`)
      .then((res) => {
        const data = cmsData;
        data.urgencies = res.data;
        setCmsData(data);
        return res.data;
      });
    return result;
  } else {
    return cmsData.urgencies;
  }
}

export function getAdvisoryStatuses(cmsData, setCmsData) {
  if (!cmsData.advisoryStatuses) {
    const result = cmsAxios
      .get(`/advisory-statuses?_limit=-1&_sort=code`)
      .then((res) => {
        const data = cmsData;
        data.advisoryStatuses = res.data;
        setCmsData(data);
        return res.data;
      });
    return result;
  } else {
    return cmsData.advisoryStatuses;
  }
}

export function getLinkTypes(cmsData, setCmsData) {
  if (!cmsData.linkTypes) {
    const result = cmsAxios
      .get(`/link-types?_limit=-1&_sort=id`)
      .then((res) => {
        const data = cmsData;
        data.linkTypes = res.data;
        setCmsData(data);
        return res.data;
      });
    return result;
  } else {
    return cmsData.linkTypes;
  }
}

export function getBusinessHours(cmsData, setCmsData) {
  if (!cmsData.businessHours) {
    const result = cmsAxios.get(`/business-hours`).then((res) => {
      const data = cmsData;
      data.businessHours = res.data;
      setCmsData(data);
      return res.data;
    });
    return result;
  } else {
    return cmsData.businessHours;
  }
}
