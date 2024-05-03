import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from  "../../shared/button/Button";
import Header from "../../composite/header/Header";
import "./Home.css";
import config from "../../../utils/config";

export default function Home({ page: { setError } }) {
  const { initialized, keycloak } = useKeycloak();
  const [toDashboard, setToDashboard] = useState(false);

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      setToDashboard(true);
    }
  }, [initialized, keycloak]);

  if (toDashboard) {
    return (
      <Redirect
        to={{
          pathname: `/advisories`,
          index: 0,
        }}
      />
    );
  }

  return (
    <main>
      <Header />
      <div className="Home" data-testid="Home">
        <div className="container hm-container">
          <h1>Staff web portal</h1>
          <h3>Please log in to continue</h3>
          <div className="row">
            <div className="col-lg-4"></div>
            <div className="col-lg-4">
              <form className="form-home">
                <div className="container-fluid ad-form">
                  <div className="row hm-row ">
                    <Button
                      onClick={() =>
                        keycloak.login({
                          redirectUri: `${config.REACT_APP_FRONTEND_BASE_URL}/advisories`,
                          idpHint: 'idir'
                        })
                      }
                      label="Login"
                      styling="bcgov-normal-blue btn"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div>
            <p>
              Can't login? Contact the web team at{" "}
              <a href="mailto:parksweb@gov.bc.ca">parksweb@gov.bc.ca</a>.
            </p>
            <p>
              If you are a <b>park operator</b>, please contact your
              <br /> regional staff representative to report any advisory.
              <br />
              Business hours of the web team: <br />
              Monday–Friday, 8:30am–4:30pm
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

Home.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
  }).isRequired,
};
