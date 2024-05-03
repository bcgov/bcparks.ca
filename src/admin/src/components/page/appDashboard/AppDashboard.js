import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import "./AppDashboard.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AdvisoryDashboard from "../advisoryDashboard/AdvisoryDashboard";
import ParkSearch from "../parkSearch/ParkSearch";
import ParkAccessStatus from "../parkAccessStatus/ParkAccessStatus";
import Header from "../../composite/header/Header";
import PrivateElement from "../../../auth/PrivateElement";
import TabPanel from "../../base/tabPanel/TabPanel";
import { a11yProps } from "../../../utils/AppUtil";

export default function AppDashboard({
  page: { setError, cmsData, setCmsData },
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [tabOrientation, setTabOrientation] = useState("vertical");
  const history = useHistory();
  const tabUrls = ["/dashboard", "/park-access-status", "/activities-and-facilities"];

  useEffect(() => {
    const path = window.location.pathname;
    const tabIndex = tabUrls.indexOf(path);
    if (tabIndex >= 0) {
      setTabIndex(tabIndex);
    }
    const width = window ? window.innerWidth : 0;
    if (width > 991.98) {
      setTabOrientation("vertical");
    } else {
      setTabOrientation("horizontal");
    }
    // eslint-disable-next-line 
  }, [setTabIndex, setTabOrientation]);

  const handleTabChange = (event, val) => {
    setTabIndex(val);
    switch (val) {
      case 0:
        history.push('/advisories');
        break;
      case 1:
        history.push('/park-access-status');
        break;
      case 2:
        history.push('/activities-and-facilities');
        break;
      default:
        history.push('/');
    }
  };

  return (
    <main>
      <Header handleTabChange={handleTabChange} />
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
            <Tab
              label="Park Access Status"
              {...a11yProps(1, "dashboard-tab")}
            />
            {PrivateElement(["approver"]) && (
              <Tab
                label="Activities & Facilities"
                {...a11yProps(2, "dashboard-tab")}
              />
            )}
          </Tabs>
          <TabPanel value={tabIndex} index={0} label="dashboard">
            <AdvisoryDashboard page={{ setError, cmsData, setCmsData }} />
          </TabPanel>
          <TabPanel value={tabIndex} index={1} label="dashboard">
            <ParkAccessStatus />
          </TabPanel>
          {PrivateElement(["approver"]) && (
            <TabPanel value={tabIndex} index={2} label="dashboard">
              <ParkSearch page={{ setError, cmsData, setCmsData }} />
            </TabPanel>
          )}
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
