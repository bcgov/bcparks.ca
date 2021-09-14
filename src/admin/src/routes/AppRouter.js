import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "../components/page/home/Home";
import Error from "../components/page/error/Error";
import About from "../components/page/about/About";
import Advisory from "../components/page/advisory/Advisory";
import AdvisorySummary from "../components/page/advisorySummary/AdvisorySummary";
import AppDashboard from "../components/page/appDashboard/AppDashboard";
import ParkInfo from "../components/page/parkInfo/ParkInfo";
import { PrivateRoute } from "../auth/PrivateRoute";
import CmsContents from "../components/page/cmsContents/CmsContents";
import ParkAccessStatus from "../components/page/parkAccessStatus/ParkAccessStatus";

function AppRouter() {
  const [error, setError] = useState({});
  const [cmsData, setCmsData] = useState({});

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/bcparks" />
          <Route exact path="/bcparks">
            <Home page={{ setError }} />
          </Route>
          <Route exact path="/bcparks/about">
            <About />
          </Route>
          <Route exact path="/bcparks/cms-contents">
            <CmsContents />
          </Route>
          <Route exact path="/bcparks/park-access-status">
            <ParkAccessStatus />
          </Route>
          <PrivateRoute
            roles={["submitter", "approver"]}
            path="/bcparks/dashboard"
            component={AppDashboard}
            props={{ page: { setError, cmsData, setCmsData } }}
          />
          <PrivateRoute
            roles={["approver"]}
            path="/bcparks/park-info/:id"
            component={ParkInfo}
            props={{ page: { setError, cmsData, setCmsData } }}
          />
          <PrivateRoute
            roles={["submitter", "approver"]}
            path="/bcparks/create-advisory"
            component={Advisory}
            props={{ mode: "create", page: { setError, cmsData, setCmsData } }}
          />
          <PrivateRoute
            roles={["submitter", "approver"]}
            path="/bcparks/update-advisory/:id"
            component={Advisory}
            props={{ mode: "update", page: { setError, cmsData, setCmsData } }}
          />
          <PrivateRoute
            roles={["submitter", "approver"]}
            path="/bcparks/advisory-summary/:id"
            component={AdvisorySummary}
            props={{ page: { setError, cmsData, setCmsData } }}
          />
          <Route path="/bcparks/error">
            <Error page={{ error }} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default AppRouter;
