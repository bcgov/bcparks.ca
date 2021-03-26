import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Header } from "shared-components/build/components/header/Header";
import { Footer } from "shared-components/build/components/footer/Footer";
import { Dropdown } from "shared-components/build/components/dropdown/Dropdown";
import { Button } from "shared-components/build/components/button/Button";
import styles from "./Home.css";
import QuickLinks from "../../composite/quickLinks/QuickLinks";

export default function Home({ page: { header, setError } }) {
  const [parkNames, setParkNames] = useState([]);
  const [toError, setToError] = useState(false);
  const [toAdvisoryDashboard, setToAdvisoryDashboard] = useState(false);

  useEffect(() => {
    axios
      .get(`/protected-areas`)
      .then((res) => {
        const parkData = res.data;
        const parkNames = parkData.map((p) => {
          return p.ProtectedAreaName;
        });
        setParkNames(["Select a Park", ...parkNames]);
      })
      .catch(() => {
        setToError(true);
        setError({
          status: 500,
          message: "Error occurred",
        });
      });
  }, [setParkNames, setToError, setError]);

  if (toError) {
    return <Redirect to="/bcparks/error" />;
  }

  if (toAdvisoryDashboard) {
    return <Redirect to="/bcparks/advisory-dash" />;
  }

  return (
    <main>
      <Header header={header} />
      <div className={styles.Home} data-testid="Home">
        <section className="explore-bc">
          <div className="gradient">
            <div className="container">
              <div className="row justify-content-lg-center">
                <div className="col-sm-12 col-lg-8">
                  <div className="mx-3 mx-lg-0">
                    <h1>Explore BC Parks</h1>

                    <p>
                      British Columbia’s incredible system of provincial parks
                      offers experiences as unforgettable and diverse as the
                      province’s natural landscape.
                    </p>

                    <p>
                      You can find your next adventure here. If you know the
                      name of the park you want to visit, just type in the name
                      and follow the link.
                    </p>

                    <form className="form-home">
                      <Dropdown items={parkNames} onSelect={() => {}} />
                      <Button
                        onClick={() => {
                          setToAdvisoryDashboard(true);
                        }}
                        label="Submit"
                        styling="bcgov-normal-white btn"
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <QuickLinks></QuickLinks>
      </div>
      <Footer />
    </main>
  );
}

Home.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    header: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
