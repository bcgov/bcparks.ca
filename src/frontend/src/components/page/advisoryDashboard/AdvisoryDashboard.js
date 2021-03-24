import React, { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./AdvisoryDashboard.css";
import { Header } from "shared-components/build/components/header/Header";
import { Footer } from "shared-components/build/components/footer/Footer";
import { Button } from "shared-components/build/components/button/Button";
import MaterialTable from "material-table";

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
  { title: "Title", field: "Title" },
  { title: "Event Type", field: "event_type.EventType" },
  { title: "Access Status", field: "access_status.AccessStatus" },
  { title: "Last Updated", field: "updated_at" },
];

const options = {
  headerStyle: { backgroundColor: "#01579b", color: "#FFF" },
  filtering: true,
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

  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get(`/public-advisory-events`)
      .then((resp) => setRows(resp.data))
      .catch(() => {
        setToError(true);
        setError({
          status: 500,
          message: "Error occurred",
        });
      });
  }, [setToError, setError]);

  if (toHome) {
    return <Redirect to="/bcparks" />;
  }

  if (toError) {
    return <Redirect to="/bcparks/error" />;
  }

  return (
    <main>
      <Header header={header} />
      <br />
      <div className={styles.AdvisoryDashboard} data-testid="AdvisoryDashboard">
        <MaterialTable
          options={options}
          icons={tableIcons}
          columns={columns}
          data={rows}
          title="Public Advisory"
        />
        <br />
        <Button
          label="Home"
          styling="bcgov-normal-blue btn"
          onClick={() => {
            sessionStorage.clear();
            setToHome(true);
          }}
        />
      </div>
      <Footer />
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
