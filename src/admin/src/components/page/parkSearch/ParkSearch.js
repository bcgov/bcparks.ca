import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ParkSearch.css";
import { useKeycloak } from "@react-keycloak/web";
import { Redirect } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Select, { components } from "react-select";
import { Loader } from "shared-components/build/components/loader/Loader";
import { List, ListItem, ListItemText, Divider } from "@material-ui/core";
import {
  getProtectedAreas,
  getRegions,
  getSections,
  getManagementAreas,
} from "../../../utils/CmsDataUtil";
import {
  addProtectedAreasFromArea,
  addProtectedAreas,
} from "../../../utils/LocationUtil";
import { isEmpty } from "../../../validators/AdvisoryValidator";

export default function ParkSearch({
  page: { setError, cmsData, setCmsData },
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [protectedAreas, setProtectedAreas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [sections, setSections] = useState([]);
  const [managementAreas, setManagementAreas] = useState([]);
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
      if (protectedArea > 0) {
        setToDetails(true);
      }
      if (region && !isEmpty(region)) {
        const parkList = addProtectedAreasFromArea(
          region.obj,
          "managementAreas",
          [],
          managementAreas
        );
        setParkList(parkList);
      }
      if (section && !isEmpty(section)) {
        const parkList = addProtectedAreasFromArea(
          section.obj,
          "managementAreas",
          [],
          managementAreas
        );
        setParkList(parkList);
      }
      if (managementArea && !isEmpty(managementArea)) {
        const parkList = addProtectedAreas(
          managementArea.obj.protectedAreas,
          [],
          []
        );
        setParkList(parkList);
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
  ]);

  useEffect(() => {
    if (initialized && keycloak) {
      Promise.all([
        getProtectedAreas(cmsData, setCmsData),
        getRegions(cmsData, setCmsData),
        getSections(cmsData, setCmsData),
        getManagementAreas(cmsData, setCmsData),
      ])
        .then((res) => {
          const protectedAreaData = res[0];
          const protectedAreas = protectedAreaData.map((p) => ({
            label: p.protectedAreaName,
            value: p.id,
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
          setSections([...sections]);
          const managementAreaData = res[3];
          const managementAreas = managementAreaData.map((m) => ({
            label: m.managementAreaName + " Management Area",
            value: m.id,
            type: "managementArea",
            obj: m,
          }));
          setManagementAreas([...managementAreas]);
          setIsLoading(false);
        })
        .catch(() => {
          setToError(true);
          setError({
            status: 500,
            message: "Error occurred",
          });
          setIsLoading(false);
        });
    }
  }, [cmsData, initialized, keycloak, setCmsData, setError, setIsLoading]);

  if (toDetails) {
    return <Redirect to={`/bcparks/park-details/${protectedArea}`} />;
  }

  if (toError) {
    return <Redirect to="/bcparks/error" />;
  }

  return (
    <main>
      <div className="Advisory" data-testid="Advisory">
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
                  <div className="row">
                    <div className="col-lg-6 col-md-8 col-sm-12 ad-auto-margin">
                      <Select
                        options={protectedAreas}
                        value={protectedAreas.filter(
                          (e) => e.value === protectedArea
                        )}
                        onChange={(e) => setProtectedArea(e ? e.value : 0)}
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
                        options={sections}
                        value={section}
                        onChange={(e) => {
                          setSection(e);
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
                        options={managementAreas}
                        value={managementArea}
                        onChange={(e) => {
                          setManagementArea(e);
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
                          <ListItem key={p.id} className="da-list-item">
                            {p.name}
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
