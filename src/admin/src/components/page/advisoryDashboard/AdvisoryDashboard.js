import React, { useState } from "react";
import { cmsAxios } from "../../../axios_config";
import { Redirect, useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import PropTypes from "prop-types";
import styles from "./AdvisoryDashboard.css";
import { Button } from "shared-components/build/components/button/Button";
import DataTable from "../../composite/dataTable/DataTable";
import Select from "react-select";
import Moment from "react-moment";
import { Loader } from "shared-components/build/components/loader/Loader";
import IconButton from "@material-ui/core/IconButton";

import TimerIcon from "@material-ui/icons/Timer";
import Tooltip from "@material-ui/core/Tooltip";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import EditIcon from "@material-ui/icons/Edit";
import InfoIcon from "@material-ui/icons/Info";
import PublishIcon from "@material-ui/icons/Publish";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Header from "../../composite/header/Header";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import {
  getProtectedAreas,
  getManagementAreas,
} from "../../../utils/CmsDataUtil";

export default function AdvisoryDashboard({
  page: { setError, cmsData, setCmsData },
}) {
  const history = useHistory();
  const [toCreate, setToCreate] = useState(false);
  const [selectedParkId, setSelectedParkId] = useState(0);

  const fetchPublicAdvisory = async ({ queryKey }) => {
    const [, selectedParkId] = queryKey;
    let parkIdQuery =
      selectedParkId > 0 ? `&protectedAreas.id=${selectedParkId}` : "";
    const response = await Promise.all([
      getManagementAreas(cmsData, setCmsData),
      cmsAxios.get(
        `/public-advisories?_limit=500&_publicationState=preview&_sort=advisoryDate:DESC${parkIdQuery}`
      ),
    ]);

    const managementAreas = response[0];
    const publicAdvisories = response[1].data;

    const regionParksCount = managementAreas.reduce((region, item) => {
      region[item.region.id] =
        (region[item.region.id] || 0) + item.protectedAreas.length;
      return region;
    }, {});

    const data = publicAdvisories.map((publicAdvisory) => {
      publicAdvisory.associatedParks =
        publicAdvisory.protectedAreas
          .map((p) => p.protectedAreaName)
          .join(", ") +
        publicAdvisory.regions.map((r) => r.regionName).join(", ");

      let regionsWithParkCount = [];
      if (publicAdvisory.regions.length > 0) {
        publicAdvisory.regions.forEach((region) => {
          region.count = regionParksCount[region.id];
          regionsWithParkCount = [...regionsWithParkCount, region];
        });
        publicAdvisory.regions = regionsWithParkCount;
      }
      return publicAdvisory;
    });
    return data;
  };

  const publicAdvisoryQuery = useQuery(
    ["publicAdvisories", selectedParkId],
    fetchPublicAdvisory
  );

  const fetchParkNames = async () => {
    const data = await getProtectedAreas(cmsData, setCmsData);
    return data.map((p) => ({
      label: p.protectedAreaName,
      value: p.id,
    }));
  };

  const STALE_TIME_MILLISECONDS = 4 * 60 * 60 * 1000; // 4 hours
  const parkNamesQuery = useQuery("parkNames", fetchParkNames, {
    staleTime: STALE_TIME_MILLISECONDS,
  });

  const tableColumns = [
    {
      field: "urgency.urgency",
      title: (
        <Tooltip title="Urgency">
          <WarningRoundedIcon className="warningRoundedIcon" />
        </Tooltip>
      ),
      headerStyle: {
        width: 10,
      },
      cellStyle: (e, rowData) => {
        if (rowData.urgency !== null) {
          switch (rowData.urgency.urgency.toLowerCase()) {
            case "low":
              return {
                borderLeft: "8px solid #06f542",
              };
            case "medium":
              return {
                borderLeft: "8px solid #f5d20e",
              };
            case "high":
              return {
                borderLeft: "8px solid #f30505",
              };
            default:
              return {};
          }
        }
      },
      render: (rowData) => {
        return (
          <>
            <Tooltip
              title={
                rowData.urgency ? rowData.urgency.urgency : "Urgency not set"
              }
            >
              <div className="urgency-column">&nbsp;</div>
            </Tooltip>
          </>
        );
      },
    },
    {
      field: "advisoryStatus.advisoryStatus",
      title: "Status",
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => (
        <div className="advisory-status">
          {rowData.advisoryStatus && (
            <Tooltip title={rowData.advisoryStatus.advisoryStatus}>
              <span>
                {rowData.advisoryStatus.code === "DFT" && (
                  <EditIcon className="draftIcon" />
                )}
                {rowData.advisoryStatus.code === "INA" && (
                  <WatchLaterIcon className="inactiveIcon" />
                )}
                {rowData.advisoryStatus.code === "APR" && (
                  <ThumbUpIcon className="approvedIcon" />
                )}
                {rowData.advisoryStatus.code === "ARQ" && (
                  <InfoIcon className="approvalRequestedIcon" />
                )}
                {rowData.advisoryStatus.code === "PUB" && (
                  <PublishIcon className="publishedIcon" />
                )}
              </span>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      field: "advisoryDate",
      title: "Posted Date",
      render: (rowData) => {
        if (rowData.advisoryDate)
          return <Moment format="YYYY/MM/DD">{rowData.advisoryDate}</Moment>;
      },
    },
    {
      field: "title",
      title: "Headline",
      headerStyle: { width: 400 },
      cellStyle: { width: 400 },
    },
    { field: "eventType.eventType", title: "Event Type" },
    {
      field: "effectiveDate",
      title: "Start Date",
      render: (rowData) => {
        if (rowData.effectiveDate)
          return <Moment format="YYYY/MM/DD">{rowData.effectiveDate}</Moment>;
      },
    },
    {
      field: "endDate",
      title: "End Date",
      render: (rowData) => {
        if (rowData.endDate) {
          return (
            <div className="text-nowrap">
              <Moment format="YYYY/MM/DD">{rowData.endDate}</Moment>
              {rowData.expiryDate && (
                <Tooltip
                  title={
                    <span>
                      Expiry Date:
                      <Moment format="YYYY/MM/DD">{rowData.expiryDate}</Moment>
                    </span>
                  }
                >
                  <TimerIcon color="primary" />
                </Tooltip>
              )}
            </div>
          );
        }
      },
    },
    {
      field: "associatedParks",
      title: "Associated Park(s)",
      headerStyle: { width: 400 },
      cellStyle: { width: 400 },
      render: (rowData) => {
        const displayCount = 3;
        const regionsCount = rowData.regions.length;
        if (regionsCount > 0) {
          let regions = rowData.regions
            .slice(0, displayCount)
            .map((p) => `${p.regionName} Region (${p.count} parks)`)
            .join(", ");
          if (regionsCount > displayCount) {
            regions = `${regions}... +${regionsCount - displayCount} more`;
          }
          return regions;
        }
        const parksCount = rowData.protectedAreas.length;
        if (parksCount > 0) {
          let parks = rowData.protectedAreas
            .slice(0, displayCount)
            .map((p) => p.protectedAreaName)
            .join(", ");
          if (parksCount > displayCount) {
            parks = `${parks}... +${parksCount - displayCount} more`;
          }
          return parks;
        }
      },
    },
    {
      title: "",
      field: "id",
      filtering: false,
      headerStyle: {
        width: 10,
        maxWidth: 10,
        minWidth: 10,
      },
      cellStyle: {
        width: 10,
        maxWidth: 10,
        minWidth: 10,
        textAlign: "right",
        paddingRight: "10px",
      },
      render: (rowData) => (
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  if (parkNamesQuery.isError || publicAdvisoryQuery.isError) {
    return <Redirect to="/bcparks/error" />;
  }

  if (toCreate) {
    return <Redirect to="/bcparks/create-advisory" />;
  }

  const DEFAULT_PAGE_SIZE = 50;

  return (
    <main>
      <Header
        header={{
          name: "",
        }}
      />
      <br />
      {parkNamesQuery.isLoading && (
        <div className="page-loader">
          <Loader page />
        </div>
      )}
      {!parkNamesQuery.isLoading && (
        <div
          className={styles.AdvisoryDashboard}
          data-testid="AdvisoryDashboard"
        >
          <div className="container-fluid">
            <div className="row ad-row">
              <div className="col-lg-6 col-md-4 col-sm-12 ad-label">
                <h2 className="float-left">Public Advisories</h2>
              </div>
              <div className="col-lg-6 col-md-4 col-sm-12 ad-label">
                <Button
                  label="Create a new Advisory"
                  styling="bcgov-normal-yellow btn"
                  onClick={() => {
                    sessionStorage.clear();
                    setToCreate(true);
                  }}
                />
              </div>
            </div>
            <Select
              options={parkNamesQuery.data}
              onChange={(e) => setSelectedParkId(e ? e.value : 0)}
              placeholder="Select a Park..."
              className="bcgov-select"
              isClearable
            />
          </div>
          <br />
          {publicAdvisoryQuery.isLoading && (
            <div className="page-loader">
              <Loader page />
            </div>
          )}
          {!publicAdvisoryQuery.isLoading && (
            <div className="container-fluid">
              <DataTable
                key={publicAdvisoryQuery.data.length}
                options={{
                  filtering: true,
                  search: false,
                  pageSize:
                    publicAdvisoryQuery.data.length > DEFAULT_PAGE_SIZE
                      ? DEFAULT_PAGE_SIZE
                      : publicAdvisoryQuery.data.length,
                  pageSizeOptions: [25, 50, 100],
                }}
                columns={tableColumns}
                data={publicAdvisoryQuery.data}
                title=""
                onRowClick={(event, rowData) => {
                  history.push(`advisory-summary/${rowData.id}`);
                }}
                components={{
                  Toolbar: (props) => <div></div>,
                }}
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
}

AdvisoryDashboard.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    cmsData: PropTypes.object.isRequired,
    setCmsData: PropTypes.func.isRequired,
  }).isRequired,
};
