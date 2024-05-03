import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ParkSearch.css";
import { useKeycloak } from "@react-keycloak/web";
import { Redirect } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Select, { components } from "react-select";
import { Loader } from "../../shared/loader/Loader";
import { List, ListItem, Divider } from "@material-ui/core";
import {
  getProtectedAreas,
  getRegions,
  getSections,
  getManagementAreas,
  getSites,
} from "../../../utils/CmsDataUtil";
import {
  addProtectedAreasFromArea,
  addProtectedAreas,
} from "../../../utils/LocationUtil";
import { isEmpty } from "../../../utils/AppUtil";

export default function ParkSearch({
  page: { setError, cmsData, setCmsData },
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [protectedAreas, setProtectedAreas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [sections, setSections] = useState([]);
  const [managementAreas, setManagementAreas] = useState([]);
  // const [sites, setSites] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [filteredManagementAreas, setFilteredManagementAreas] = useState([]);
  const [protectedArea, setProtectedArea] = useState(0);
  const [region, setRegion] = useState();
  const [section, setSection] = useState();
  const [managementArea, setManagementArea] = useState();
  const { keycloak, initialized } = useKeycloak();
  const [toError, setToError] = useState(false);
  const [toDetails, setToDetails] = useState(false);
  const [parkList, setParkList] = useState([]);

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <SearchIcon />
      </components.DropdownIndicator>
    );
  };

  useEffect(() => {
    if (!isLoading) {
      setParkList([]);
      let parkList = [];
      let parkIds = [];
      if (protectedArea > 0) {
        setToDetails(true);
      }
      if (managementArea && !isEmpty(managementArea)) {
        parkList = addProtectedAreas(
          managementArea.obj.protectedAreas,
          null,
          parkIds,
          null,
          parkList
        );
        setParkList(parkList);
      } else if (section && !isEmpty(section)) {
        parkList = addProtectedAreasFromArea(
          section.obj,
          "managementAreas",
          parkIds,
          null,
          null,
          managementAreas,
          parkList
        );
        setParkList(parkList);
      } else if (region && !isEmpty(region)) {
        parkList = addProtectedAreasFromArea(
          region.obj,
          "managementAreas",
          parkIds,
          null,
          null,
          managementAreas,
          parkList
        );
        setParkList(parkList);
      }
      setFilteredSections(sections);
      setFilteredManagementAreas(managementAreas);
      if (section && !isEmpty(section)) {
        const filteredManagementAreas = managementAreas.filter(
          (m) => m.obj.section?.id === section.value
        );
        setFilteredManagementAreas([...filteredManagementAreas]);
      }
      if (region && !isEmpty(region)) {
        const filteredSections = sections.filter(
          (s) => s.obj.region?.id === region.value
        );
        setFilteredSections([...filteredSections]);
        if (!section) {
          const filteredManagementAreas = managementAreas.filter(
            (m) => m.obj.region?.id === region.value
          );
          setFilteredManagementAreas([...filteredManagementAreas]);
        }
      }
    }
  }, [
    protectedArea,
    isLoading,
    region,
    regions,
    managementAreas,
    setParkList,
    section,
    managementArea,
    sections,
    setFilteredSections,
    setFilteredManagementAreas,
  ]);

  useEffect(() => {
    if (initialized && keycloak) {
      Promise.all([
        getProtectedAreas(cmsData, setCmsData),
        getRegions(cmsData, setCmsData),
        getSections(cmsData, setCmsData),
        getManagementAreas(cmsData, setCmsData),
        getSites(cmsData, setCmsData),
      ])
        .then((res) => {
          const protectedAreaData = res[0];
          const protectedAreas = protectedAreaData.map((p) => ({
            label: p.protectedAreaName,
            value: p.id,
            orcs: p.orcs,
            type: "protectedArea",
          }));
          setProtectedAreas([...protectedAreas]);
          const regionData = res[1];
          const regions = regionData.map((r) => ({
            label: r.regionName + " Region",
            value: r.id,
            type: "region",
            obj: r,
          }));
          setRegions([...regions]);
          const sectionData = res[2];
          const sections = sectionData.map((s) => ({
            label: s.sectionName + " Section",
            value: s.id,
            type: "section",
            obj: s,
          }));
          setFilteredSections([...sections]);
          setSections([...sections]);
          const managementAreaData = res[3];
          const managementAreas = managementAreaData.map((m) => ({
            label: m.managementAreaName + " Management Area",
            value: m.id,
            type: "managementArea",
            obj: m,
          }));
          setFilteredManagementAreas([...managementAreas]);
          setManagementAreas([...managementAreas]);
          // const siteData = res[4];
          // const sites = siteData.map((s) => ({
          //   label: s.protectedArea.protectedAreaName + ": " + s.siteName,
          //   value: s.id,
          //   type: "site",
          //   obj: s,
          // }));
          // sites.sort(labelCompare);
          // setSites([...sites]);
          setIsLoading(false);
        })
        .catch(() => {
          setToError(true);
          setError({
            status: 500,
            message: "Error loading park search",
          });
          setIsLoading(false);
        });
    }
  }, [cmsData, initialized, keycloak, setCmsData, setError, setIsLoading]);

  const filterSection = (event) => {
    if (event) {
      const section = sections.filter((s) => s.value === event.obj.section.id);
      if (section.length > 0) {
        setSection(section[0]);
      }
    }
  };

  const filterRegion = (event) => {
    if (event) {
      const region = regions.filter((r) => r.value === event.obj.region?.id);
      if (region.length > 0) {
        setRegion(region[0]);
      }
    }
  };

  if (toDetails) {
    return <Redirect push to={`/park-info/${protectedArea}`} />;
  }

  if (toError) {
    return <Redirect push to="/error" />;
  }

  return (
    <main>
      <div className="ParkSearch" data-testid="ParkSearch">
        <div className="container">
          {isLoading && (
            <div className="page-loader">
              <Loader page />
            </div>
          )}
          {!isLoading && (
            <>
              <form>
                <div className="container-fluid ad-form">
                  <div className="row mt20">
                    <div className="col-lg-6 col-md-8 col-sm-12 ad-auto-margin">
                      <Select
                        options={protectedAreas}
                        value={protectedAreas.filter(
                          (e) => e.orcs === protectedArea
                        )}
                        onChange={(e) => setProtectedArea(e ? e.orcs : 0)}
                        placeholder="Find a park by name"
                        className="bcgov-select"
                        onBlur={() => {}}
                        isClearable
                        components={{ DropdownIndicator }}
                      />
                    </div>
                  </div>
                  <div className="row mt20">
                    <div className="col-lg-6 col-md-8 col-sm-12 ad-auto-margin">
                      <Select
                        options={regions}
                        value={region}
                        onChange={(e) => {
                          setRegion(e);
                          setSection(null);
                          setManagementArea(null);
                        }}
                        placeholder="Select the Region"
                        className="bcgov-select"
                        isClearable
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-md-8 col-sm-12 ad-auto-margin">
                      <Select
                        options={filteredSections}
                        value={section}
                        onChange={(e) => {
                          setSection(e);
                          setManagementArea(null);
                          filterRegion(e);
                        }}
                        placeholder="Select the Section"
                        className="bcgov-select"
                        isClearable
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-md-8 col-sm-12 ad-auto-margin">
                      <Select
                        options={filteredManagementAreas}
                        value={managementArea}
                        onChange={(e) => {
                          setManagementArea(e);
                          filterSection(e);
                          filterRegion(e);
                        }}
                        placeholder="Select the Management Area"
                        className="bcgov-select"
                        isClearable
                      />
                    </div>
                  </div>
                </div>
              </form>
              {parkList.length > 0 && (
                <div className="container">
                  <div className="row mt20">
                    <div className="col-lg-10 col-md-12 col-sm-12 ad-auto-margin">
                      <List>
                        <ListItem className="da-list-header" key="item-header">
                          Park name
                        </ListItem>
                        <Divider />
                        {parkList.map((p) => (
                          <ListItem key={p.orcs} className="da-list-item">
                            <div
                              className="ad-anchor pointer"
                              onClick={() => {
                                setProtectedArea(p.orcs);
                              }}
                            >
                              {p.name}
                            </div>
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <br />
      </div>
    </main>
  );
}

ParkSearch.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    cmsData: PropTypes.object.isRequired,
    setCmsData: PropTypes.func.isRequired,
  }).isRequired,
};
