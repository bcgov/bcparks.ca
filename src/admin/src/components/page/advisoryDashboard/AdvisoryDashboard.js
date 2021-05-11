import React, { useState, useEffect, forwardRef } from "react";
import { cmsAxios } from "../../../axios_config";
import { Redirect, Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./AdvisoryDashboard.css";
import { Button } from "shared-components/build/components/button/Button";
import MaterialTable from "material-table";
import Select from "react-select";
import Moment from "react-moment";
import { Loader } from "shared-components/build/components/loader/Loader";
import IconButton from "@material-ui/core/IconButton";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import TimerIcon from "@material-ui/icons/Timer";
import Tooltip from "@material-ui/core/Tooltip";
import ViewColumn from "@material-ui/icons/ViewColumn";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import EditIcon from "@material-ui/icons/Edit";
import InfoIcon from "@material-ui/icons/Info";
import PublishIcon from "@material-ui/icons/Publish";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { useKeycloak } from "@react-keycloak/web";
import Header from "../../composite/header/Header";

export default function AdvisoryDashboard({ page: { setError } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [toError, setToError] = useState(false);
  const [toHome, setToHome] = useState(false);
  const [toCreate, setToCreate] = useState(false);
  const [parkNames, setParkNames] = useState([]);
  const { keycloak, initialized } = useKeycloak();
  const [rows, setRows] = useState([]);
  const [selectedParkId, setSelectedParkId] = useState(0);

  const columns = [
    {
      field: "Urgency.Urgency",
      title: "U",
      headerStyle: {
        width: 10,
      },
      cellStyle: (e, rowData) => {
        if (rowData.Urgency !== null) {
          switch (rowData.Urgency.Urgency.toLowerCase()) {
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
            <div className="urgency-column"></div>
          </>
        );
      },
    },
    {
      field: "AdvisoryStatus.AdvisoryStatus",
      title: "Status",
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => (
        <div className="advisory-status">
          <Tooltip title={rowData.AdvisoryStatus.AdvisoryStatus}>
            <span>
              {rowData.AdvisoryStatus.Code === "DFT" && (
                <EditIcon className="draftIcon" />
              )}
              {rowData.AdvisoryStatus.Code === "INA" && (
                <WatchLaterIcon className="inactiveIcon" />
              )}
              {rowData.AdvisoryStatus.Code === "ACT" && (
                <CheckCircleIcon className="activeIcon" />
              )}
              {rowData.AdvisoryStatus.Code === "APR" && (
                <ThumbUpIcon className="approvedIcon" />
              )}
              {rowData.AdvisoryStatus.Code === "ARQ" && (
                <InfoIcon className="approvalRequestedIcon" />
              )}
              {rowData.AdvisoryStatus.Code === "PUB" && (
                <PublishIcon className="publishedIcon" />
              )}
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      field: "AdvisoryDate",
      title: "Posted Date",
      render: (rowData) => {
        if (rowData.AdvisoryDate)
          return <Moment format="MMM DD, YYYY">{rowData.AdvisoryDate}</Moment>;
      },
    },
    {
      field: "Title",
      title: "Headline",
      headerStyle: { width: 400 },
      cellStyle: { width: 400 },
    },
    { field: "EventType.EventType", title: "Event Type" },
    {
      field: "EffectiveDate",
      title: "Start Date",
      render: (rowData) => {
        if (rowData.EffectiveDate)
          return <Moment format="MMM DD, YYYY">{rowData.EffectiveDate}</Moment>;
      },
    },
    {
      field: "EndDate",
      title: "End Date",
      render: (rowData) => {
        if (rowData.EndDate) {
          return (
            <div className="text-nowrap">
              <Moment format="MMM DD, YYYY">{rowData.EndDate}</Moment>
              {rowData.ExpiryDate && (
                <Tooltip
                  title={
                    <span>
                      Expiry Date:
                      <Moment format="MMM DD, YYYY">
                        {rowData.ExpiryDate}
                      </Moment>
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
      field: "ProtectedAreas",
      title: "Associated Park(s)",
      headerStyle: { width: 400 },
      cellStyle: { width: 400 },
      render: (rowData) => {
        if (rowData.ProtectedAreas != null) {
          const parks = rowData.ProtectedAreas.map(
            (p) => p.ProtectedAreaName
          ).join(", ");
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
        <Link to={`update-advisory/${rowData.id}`}>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Link>
      ),
    },
  ];

  const options = {
    headerStyle: {
      backgroundColor: "#e3eaf8",
      zIndex: 0,
      padding: "2px",
      fontWeight: "bolder",
    },
    cellStyle: { padding: 2 },
    rowStyle: {},
    filtering: true,
    search: false,
  };

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  useEffect(() => {
    if (!initialized) {
      setIsLoading(true);
    } else if (!keycloak.authenticated) {
      setToError(true);
      setError({
        status: 401,
        message: "Login required",
      });
    } else {
      let parkIdQuery = "";
      if (selectedParkId > 0) {
        parkIdQuery = `&ProtectedAreas.id=${selectedParkId}`;
      }
      Promise.all([
        cmsAxios.get(`/protectedAreas?_limit=-1&_sort=ProtectedAreaName`),
        cmsAxios.get(
          `/public-advisories?_publicationState=preview&_sort=updated_at:DESC${parkIdQuery}`
        ),
      ])
        .then((res) => {
          const parkNamesData = res[0].data;
          const publicAdvisoryData = res[1].data;
          const parkNames = parkNamesData.map((p) => ({
            label: p.ProtectedAreaName,
            value: p.id,
          }));
          setParkNames(["Select a Park", ...parkNames]);
          setRows(publicAdvisoryData);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setToError(true);
          setError({
            status: 500,
            message: "Error occurred",
          });
        });
    }
  }, [
    setParkNames,
    setToError,
    setIsLoading,
    setError,
    setRows,
    selectedParkId,
    setToHome,
    keycloak,
    initialized,
  ]);

  if (toHome) {
    return <Redirect to="/bcparks" />;
  }

  if (toError) {
    return <Redirect to="/bcparks/error" />;
  }

  if (toCreate) {
    return <Redirect to="/bcparks/create-advisory" />;
  }

  return (
    <main>
      <Header
        header={{
          name: "",
        }}
      />
      <br />
      {isLoading && (
        <div className="page-loader">
          <Loader page />
        </div>
      )}
      {!isLoading && (
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
              options={parkNames}
              onChange={(e) => setSelectedParkId(e.value)}
              placeholder="Select a Park..."
              className="bcgov-select"
            />
          </div>
          <br />

          <div className="container-fluid">
            <MaterialTable
              options={options}
              icons={tableIcons}
              columns={columns}
              data={rows}
              title=""
              components={{
                Toolbar: (props) => <div></div>,
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}

AdvisoryDashboard.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
  }).isRequired,
};
