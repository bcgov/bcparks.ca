import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "../components/page/home/Home";
import Error from "../components/page/error/Error";
import About from "../components/page/about/About";
import AdvisoryDashboard from "../components/page/advisoryDashboard/AdvisoryDashboard";
import Advisory from "../components/page/advisory/Advisory";
import AdvisorySummary from "../components/page/advisorySummary/AdvisorySummary";
import { PrivateRoute } from "../utils/PrivateRoute";

function AppRouter() {
  const [error, setError] = useState({});

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
          <PrivateRoute
            roles={["manage-account"]}
            path="/bcparks/advisory-dash"
            component={AdvisoryDashboard}
            props={{ page: { setError } }}
          />
          <PrivateRoute
            roles={["manage-account"]}
            path="/bcparks/create-advisory"
            component={Advisory}
            props={{ mode: "create", page: { setError } }}
          />
          <PrivateRoute
            roles={["manage-account"]}
            path="/bcparks/update-advisory/:id"
            component={Advisory}
            props={{ mode: "update", page: { setError } }}
          />
          <PrivateRoute
            roles={["manage-account"]}
            path="/bcparks/advisory-summary/:id"
            component={AdvisorySummary}
            props={{ page: { setError } }}
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
