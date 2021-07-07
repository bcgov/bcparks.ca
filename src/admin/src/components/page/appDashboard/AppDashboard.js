import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "./AppDashboard.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AdvisoryDashboard from "../advisoryDashboard/AdvisoryDashboard";
import ParkSearch from "../parkSearch/ParkSearch";
import Header from "../../composite/header/Header";
import PrivateElement from "../../../auth/PrivateElement";
import TabPanel from "../../base/tabPanel/TabPanel";
import { a11yProps } from "../../../utils/AppUtil";

export default function AppDashboard({
  page: { setError, cmsData, setCmsData },
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const { index } = useLocation();
  const [tabOrientation, setTabOrientation] = useState("vertical");

  useEffect(() => {
    if (index) {
      setTabIndex(index);
    }
    const width = window ? window.innerWidth : 0;
    if (width > 991.98) {
      setTabOrientation("vertical");
    } else {
      setTabOrientation("horizontal");
    }
  }, [setTabIndex, setTabOrientation, index]);

  const handleTabChange = (event, val) => {
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
            orientation={tabOrientation}
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="Dashboard"
            className="app-tab"
            variant="fullWidth"
          >
            <Tab label="Advisories" {...a11yProps(0, "dashboard-tab")} />
            {PrivateElement(["approver"]) && (
              <Tab
                label="Activities & Facilities"
                {...a11yProps(1, "dashboard-tab")}
              />
            )}
          </Tabs>
          <TabPanel value={tabIndex} index={0} label="dashboard">
            <AdvisoryDashboard page={{ setError, cmsData, setCmsData }} />
          </TabPanel>
          <TabPanel value={tabIndex} index={1} label="dashboard">
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
