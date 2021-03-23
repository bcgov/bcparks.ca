import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./AdvisoryDashboard.css";
import { Header } from "shared-components/build/components/header/Header";
import { Footer } from "shared-components/build/components/footer/Footer";
import { Button } from "shared-components/build/components/button/Button";
import { DataGrid } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "Title", headerName: "Title", width: 500 },
  { field: "Submitter", headerName: "Submitted By", width: 140 },
  {
    field: "AccessStatus",
    headerName: "Access",
    width: 140,
    valueGetter: (params) => {
      return params.row.access_status
        ? params.row.access_status.AccessStatus
        : "";
    },
  },
  {
    field: "Event",
    headerName: "Event",
    width: 140,
    valueGetter: (params) => {
      return params.row.event_type ? params.row.event_type.EventType : "";
    },
  },
  { field: "AdvisoryStatus", headerName: "Status", width: 200 },
  { field: "updated_at", headerName: "Last Updated", width: 200 },
];

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
      <h3>Public Advisories</h3>
      <div className={styles.AdvisoryDashboard} data-testid="AdvisoryDashboard">
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
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
