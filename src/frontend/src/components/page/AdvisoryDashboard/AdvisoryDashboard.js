import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./AdvisoryDashboard.css";
import { Header } from "shared-components/build/components/header/Header";
import { Footer } from "shared-components/build/components/footer/Footer";
import { Button } from "shared-components/build/components/button/Button";

export default function AdvisoryDashboard({ page: { header, setError } }) {
  const [toError, setToError] = useState(false);
  const [toHome, setToHome] = useState(false);

  if (toHome) {
    return <Redirect to="/bcparks" />;
  }

  if (toError) {
    return <Redirect to="/bcparks/error" />;
  }

  return (
    <main>
      <Header header={header} />
      <div className={styles.AdvisoryDashboard} data-testid="AdvisoryDashboard">
        <p>Advisory dashboard here!</p>
        <Button
          label="Home"
          styling="bcgov-normal-blue btn"
          onClick={() => {
            sessionStorage.clear();
            setToHome(true);
          }}
        />
      </div>
      <Footer />
    </main>
  );
}

AdvisoryDashboard.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    header: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
