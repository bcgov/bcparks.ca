import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import "../../page.css";
import { Button } from "../../shared/button/Button";
import Header from "../../composite/header/Header";

export default function Error({ page: { error } }) {
  const [toHome, setToHome] = useState(false);
  const history = useHistory();

  const handleMenuChange = (event, val) => {
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

  if (toHome) {
    return <Redirect to="/" />;
  }
  let errorContent;
  if (!error) {
    errorContent = (
      <div>
        <h1>Service is currently unavailable</h1>
        <p>Please try again later.</p>
      </div>
    );
  } else if (error.status === 403) {
    if (error.message === "Login failed") {
      errorContent = (
        <div>
          <h1>Login failed</h1>
          <p>Unable to login, please try again later.</p>
        </div>
      );
    } else if (error.message === "Unauthorized") {
      errorContent = (
        <div>
          <h1>Staff web portal</h1>
          <br />
          <p>
            Please contact the web team at{" "}
            <a href="mailto:parksweb@gov.bc.ca?subject=Access%20to%20BC%20Parks%20Staff%20Portal">
              parksweb@gov.bc.ca
            </a>{" "}
            to request access.
          </p>
        </div>
      );
    } else {
      errorContent = (
        <div>
          <h1>Unauthorized entry</h1>
          <p>
            Unauthorized user entry, please return to the home page and begin
            your session again.
          </p>
        </div>
      );
    }
  } else if (error.status === 590) {
    errorContent = (
      <div>
        <h1>Your session has expired</h1>
        <p>Please return to the home page and begin your session again.</p>
      </div>
    );
  } else {
    errorContent = (
      <div>
        <h1>An unknown error has occurred</h1>
        <p>
          The error description is below. If this error persists, please try
          again later.
          <br />
          <br />
          {console.log('error', error)}
          {error.message}
        </p>
      </div>
    );
  }

  return (
    <main>
      <Header handleTabChange={handleMenuChange} />
      <div className="page" data-testid="Error">
        <div className="content col-md-8">
          <br />
          {errorContent}
          <br />
          <div className="buttons">
            <Button
              label="Home"
              styling="bcgov-normal-blue btn"
              onClick={() => {
                sessionStorage.clear();
                setToHome(true);
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

Error.propTypes = {
  page: PropTypes.shape({
    error: PropTypes.object.isRequired,
  }).isRequired,
};
