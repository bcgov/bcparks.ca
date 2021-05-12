import React from "react";
import PropTypes from "prop-types";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "shared-components/build/components/button/Button";
import Header from "../../composite/header/Header";
import styles from "./Home.css";

export default function Home({ page: { setError } }) {
  const { keycloak } = useKeycloak();
  return (
    <main>
      <Header
        header={{
          name: "",
        }}
      />
      <div className={styles.Home} data-testid="Home">
        <div className="container hm-container">
          <h1>BC Parks Staff Portal</h1>
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
                          redirectUri: `${process.env.REACT_APP_FRONTEND_BASE_URL}/bcparks/advisory-dash`,
                        })
                      }
                      label="Login"
                      styling="bcgov-normal-yellow btn"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div>
            <p>
              Can't login? Contact the web team at{" "}
              <a href="parksweb@gov.bc.ca">parksweb@gov.bc.ca</a>.
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
