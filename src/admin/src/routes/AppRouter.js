import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "../components/page/home/Home";
import Error from "../components/page/error/Error";
// import About from "../components/page/about/About";
import Advisory from "../components/page/advisory/Advisory";
import AdvisorySummary from "../components/page/advisorySummary/AdvisorySummary";
import AppDashboard from "../components/page/appDashboard/AppDashboard";
import ParkInfo from "../components/page/parkInfo/ParkInfo";
import { PrivateRoute } from "../auth/PrivateRoute";
// import CmsContents from "../components/page/cmsContents/CmsContents";
import AdvisoryLink from "../components/page/advisoryLink/AdvisoryLink";

function AppRouter() {
  const [error, setError] = useState({});
  const [cmsData, setCmsData] = useState({});

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home page={{ setError }} />
          </Route>
          {/* We could delete it since it's not used */}
          {/* <Route exact path="/about">
            <About />
          </Route> */}
          {/* We could delete it since it's not used */}
          {/* <Route exact path="/cms-contents">
            <CmsContents />
          </Route> */}
          <PrivateRoute
            roles={["submitter", "approver"]}
            path="/advisories"
            component={AppDashboard}
            props={{ page: { setError, cmsData, setCmsData } }}
          />
          <PrivateRoute
            roles={["submitter", "approver"]}
            path="/park-access-status"
            component={AppDashboard}
            props={{ page: { setError, cmsData, setCmsData } }}
          />
          <PrivateRoute
            roles={["submitter", "approver"]}
            path="/activities-and-facilities"
            component={AppDashboard}
            props={{ page: { setError, cmsData, setCmsData } }}
          />
          <PrivateRoute
            roles={["approver"]}
            path="/park-info/:id"
            component={ParkInfo}
            props={{ page: { setError, cmsData, setCmsData } }}
          />
          <PrivateRoute
            roles={["submitter", "approver"]}
            path="/create-advisory"
            component={Advisory}
            props={{ mode: "create", page: { setError, cmsData, setCmsData } }}
          />
          <PrivateRoute
            roles={["submitter", "approver"]}
            path="/update-advisory/:id"
            component={Advisory}
            props={{ mode: "update", page: { setError, cmsData, setCmsData } }}
          />
          <PrivateRoute
            roles={["submitter", "approver"]}
            path="/advisory-summary/:id"
            component={AdvisorySummary}
            props={{ page: { setError, cmsData, setCmsData } }}
          />
          <Route exact path="/advisory-link/:advisoryNumber">
            <AdvisoryLink />
          </Route>
          <Route path="/error">
            <Error page={{ error }} />
          </Route>
          <Redirect from="*" to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default AppRouter;
