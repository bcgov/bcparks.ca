import React, { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./AdvisoryDashboard.css";
import { Header } from "shared-components/build/components/header/Header";
import { Button } from "shared-components/build/components/button/Button";
import MaterialTable from "material-table";
import Select from "react-select";
import Moment from "react-moment";

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

const columns = [
  {
    field: "urgency.Urgency",
    filtering: false,
    cellStyle: {
      width: 5,
      maxWidth: 5,
    },
    render: (rowData) => (
      <span className={rowData.urgency.Urgency.toLowerCase()}>&nbsp;</span>
    ),
  },
  {
    field: "urgency.Urgency",
    title: "Urgency",
  },
  {
    field: "advisory_status.AdvisoryStatus",
    title: "Status",
  },
  {
    field: "AdvisoryDate",
    title: "Posted Date",
    render: (rowData) => (
      <Moment format="MMM DD YYYY">{rowData.AdvisoryDate}</Moment>
    ),
  },
  { field: "Title", title: "Headline" },
  { field: "event_type.EventType", title: "Event Type" },
  {
    field: "EffectiveDate",
    title: "Start Date",
    render: (rowData) => (
      <Moment format="MMM DD YYYY">{rowData.EffectiveDate}</Moment>
    ),
  },

  {
    field: "EndDate",
    title: "End Date",
    render: (rowData) => (
      <Moment format="MMM DD YYYY">{rowData.EndDate}</Moment>
    ),
  },
  // { field: "access_status.AccessStatus", title: "Access Status" },
];

const options = {
  headerStyle: {
    backgroundColor: "#f3f3f3",
    zIndex: 0,
    padding: "2px",
    fontWeight: "bolder",
  },
  cellStyle: {},
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

export default function AdvisoryDashboard({ page: { header, setError } }) {
  const [toError, setToError] = useState(false);
  const [toHome, setToHome] = useState(false);
  const [toCreate, setToCreate] = useState(false);
  const [parkNames, setParkNames] = useState([]);
  const [selectedParkId, setSelectedParkId] = useState(0);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get(`/protectedAreas?_limit=-1&_sort=ProtectedAreaName`)
      .then((res) => {
        const parkNames = res.data.map((p) => ({
          label: p.ProtectedAreaName,
          value: p.id,
        }));
        setParkNames(["Select a Park", ...parkNames]);
      })
      .catch(() => {
        setToError(true);
        setError({
          status: 500,
          message: "Error occurred",
        });
      });
  }, [setParkNames, setToError, setError]);

  useEffect(() => {
    let url = `public-advisories?protected_areas.id=${selectedParkId}`;
    axios
      .get(url)
      .then((resp) => setRows(resp.data))
      .catch(() => {
        setToError(true);
        setError({
          status: 500,
          message: "Error occurred",
        });
      });
  }, [setToError, setError, selectedParkId]);

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
      <Header header={header} />
      <br />

      <div className={styles.AdvisoryDashboard} data-testid="AdvisoryDashboard">
        <div className="container">
          <h2>Public Advisories</h2>
          <Select
            options={parkNames}
            onChange={(e) => setSelectedParkId(e.value)}
            placeholder="Select Park..."
          />
        </div>
        <br />
        <div className="container">
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
          <br />
          <div className="txt-center">
            <Button
              label="Create Advisory"
              styling="bcgov-normal-yellow btn"
              onClick={() => {
                sessionStorage.clear();
                setToCreate(true);
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

AdvisoryDashboard.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    header: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
