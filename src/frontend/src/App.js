import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/page/Home/Home";
import Error from "./components/page/error/Error";
import { useHistory } from "react-router-dom";
import AdvisoryDashboard from "./components/page/advisoryDashboard/AdvisoryDashboard";
import CreateAdvisory from "./components/page/createAdvisory/CreateAdvisory";

function App() {
  const [error, setError] = useState({});
  const header = {
    name: "",
    history: useHistory(),
  };
  return (
    <div>
      <Switch>
        <Redirect exact from="/" to="/bcparks" />
        <Route exact path="/bcparks">
          <Home page={{ header, setError }} />
        </Route>
        <Route path="/bcparks/advisory-dash">
          <AdvisoryDashboard page={{ header, setError }} />
        </Route>
        <Route path="/bcparks/create-advisory">
          <CreateAdvisory page={{ header, setError }} />
        </Route>
        <Route path="/bcparks/error">
          <Error page={{ header, error }} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
