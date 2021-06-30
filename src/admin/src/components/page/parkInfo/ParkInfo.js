import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ParkInfo.css";
import { Redirect, useParams } from "react-router-dom";
import { Loader } from "shared-components/build/components/loader/Loader";
import { useKeycloak } from "@react-keycloak/web";
import Header from "../../composite/header/Header";
import { cmsAxios } from "../../../axios_config";
import { getRegions, getSections } from "../../../utils/CmsDataUtil";

export default function ParkInfo({ page: { setError, cmsData, setCmsData } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [toError, setToError] = useState(false);
  const [toDashboard, setToDashboard] = useState(false);
  const [protectedArea, setProtectedArea] = useState();
  const { keycloak, initialized } = useKeycloak();
  const { id } = useParams();

  // useEffect(() => {
  //   if (!isLoading) {
  //   }
  // }, [isLoading]);

  useEffect(() => {
    if (initialized && keycloak) {
      Promise.all([
        cmsAxios.get(`/protected-areas/${id}`),
        getRegions(cmsData, setCmsData),
        getSections(cmsData, setCmsData),
      ])
        .then((res) => {
          const protectedArea = res[0].data;
          const managementArea = protectedArea.managementAreas[0];
          protectedArea.managementAreaName = managementArea.managementAreaName;
          const region = cmsData.regions.filter(
            (r) => r.id === managementArea.region
          );
          if (region.length > 0) {
            protectedArea.regionName = region[0].regionName;
          }
          console.log(region);
          setProtectedArea(protectedArea);
          console.log(res[0].data);
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
  }, [id, initialized, keycloak, setError, setIsLoading]);

  if (toDashboard) {
    return (
      <Redirect
        to={{
          pathname: `/bcparks/dashboard`,
          index: 1,
        }}
      />
    );
  }

  if (toError) {
    return <Redirect to="/bcparks/error" />;
  }

  return (
    <main>
      <Header
        header={{
          name: "",
        }}
      />
      <br />
      <div className="ParkInfo" data-testid="ParkInfo">
        <div className="container">
          {isLoading && (
            <div className="page-loader">
              <Loader page />
            </div>
          )}
          {!isLoading && (
            <div>
              <h3>{protectedArea.protectedAreaName}</h3>
              <p>{protectedArea.managementAreaName} Management Area</p>
              {protectedArea.regionName && (
                <p>{protectedArea.regionName} Region</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

ParkInfo.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    cmsData: PropTypes.object.isRequired,
    setCmsData: PropTypes.func.isRequired,
  }).isRequired,
};
