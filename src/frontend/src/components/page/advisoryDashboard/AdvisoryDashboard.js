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
import ViewColumn from "@material-ui/icons/ViewColumn";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useKeycloak } from "@react-keycloak/web";
import Header from "../../composite/header/Header";

const columns = [
  {
    field: "urgency.Urgency",
    title: "Urgency",
    cellStyle: (e, rowData) => {
      if (rowData.urgency !== null) {
        switch (rowData.urgency.Urgency.toLowerCase()) {
          case "low":
            return { paddingRight: "10px", borderLeft: "8px solid #06f542" };
          case "medium":
            return { paddingLeft: "10px", borderLeft: "8px solid #f5d20e" };
          case "high":
            return { borderLeft: "10px solid #f30505" };
          default:
            return {};
        }
      }
    },
  },
  {
    field: "advisory_status.AdvisoryStatus",
    title: "Status",
  },
  {
    field: "AdvisoryDate",
    title: "Posted Date",
    render: (rowData) => {
      if (rowData.AdvisoryDate != null)
        return <Moment format="MMM DD, YYYY">{rowData.AdvisoryDate}</Moment>;
    },
  },
  { field: "Title", title: "Headline" },
  { field: "event_type.EventType", title: "Event Type" },
  {
    field: "EffectiveDate",
    title: "Start Date",
    render: (rowData) => {
      if (rowData.EffectiveDate != null)
        return <Moment format="MMM DD, YYYY">{rowData.EffectiveDate}</Moment>;
    },
  },
  {
    field: "EndDate",
    title: "End Date",
    render: (rowData) => {
      if (rowData.EndDate != null)
        return <Moment format="MMM DD, YYYY">{rowData.EndDate}</Moment>;
    },
  },
  {
    title: "",
    field: "id",
    filtering: false,
    cellStyle: {
      width: "1px",
      maxWidth: "10px",
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
  cellStyle: { padding: "4px 4px 4px 4px" },
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
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export default function AdvisoryDashboard({ page: { setError } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [toError, setToError] = useState(false);
  const [toHome, setToHome] = useState(false);
  const [toCreate, setToCreate] = useState(false);
  const [parkNames, setParkNames] = useState([]);
  const [selectedParkId, setSelectedParkId] = useState(0);
  const { keycloak, initialized } = useKeycloak();

  const [rows, setRows] = useState([]);

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
      cmsAxios
        .get(`/protectedAreas?_limit=-1&_sort=ProtectedAreaName`)
        .then((res) => {
          const parkNames = res.data.map((p) => ({
            label: p.ProtectedAreaName,
            value: p.id,
          }));
          setParkNames(["Select a Park", ...parkNames]);
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
  }, [setParkNames, setToError, setError, setToHome, keycloak, initialized]);

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
      let url = "public-advisories";
      if (selectedParkId)
        url = `${url}?protected_areas.id=${selectedParkId}_sort=updated_at:DESC`;
      cmsAxios
        .get(url)
        .then((resp) => {
          setRows(resp.data);
          setIsLoading(false);
        })
        .catch(() => {
          setToError(true);
          setError({
            status: 500,
            message: "Error occurred",
          });
        });
    }
  }, [setToError, setError, selectedParkId, keycloak, initialized]);

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
              className="bg-blue f-select"
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
