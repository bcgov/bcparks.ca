import React, { useState, useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "./AppDashboard.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import AdvisoryDashboard from "../advisoryDashboard/AdvisoryDashboard";
import ParkSearch from "../parkSearch/ParkSearch";
import Header from "../../composite/header/Header";
import PrivateElement from "../../../auth/PrivateElement";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="app-tab-content"
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-${index}`}
      aria-labelledby={`dashboard-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function AppDashboard({
  page: { setError, cmsData, setCmsData },
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const { index } = useLocation();

  useEffect(() => {
    if (index) {
      setTabIndex(index);
    }
  }, [setTabIndex, index]);

  const handleChange = (event, val) => {
    setTabIndex(val);
  };

  return (
    <main>
      <Header
        header={{
          name: "",
        }}
      />
      <div className="app-container" data-testid="AppDashboard">
        <div className="app-tabs">
          <Tabs
            orientation="vertical"
            value={tabIndex}
            onChange={handleChange}
            aria-label="Dashboard"
            className="app-tab"
          >
            <Tab label="Advisories" />
            {PrivateElement(["approver"]) && (
              <Tab label="Activities & Facilities" />
            )}
          </Tabs>
          <TabPanel value={tabIndex} index={0}>
            <AdvisoryDashboard page={{ setError, cmsData, setCmsData }} />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <ParkSearch page={{ setError, cmsData, setCmsData }} />
          </TabPanel>
        </div>
      </div>
    </main>
  );
}

AppDashboard.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    cmsData: PropTypes.object.isRequired,
    setCmsData: PropTypes.func.isRequired,
  }).isRequired,
};
