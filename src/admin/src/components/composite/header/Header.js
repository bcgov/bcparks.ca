import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";
import AccountInfo from "../accountInfo/AccountInfo";
import config from "../../../utils/config";

export const goHome = (e, history) => {
  e.stopPropagation();
  e.preventDefault();

  if (
    history.location &&
    history.location.pathname &&
    history.location.pathname === "/bcparks"
  ) {
    return false;
  }

  if (history.location.pathname === "/bcparks/error") {
    sessionStorage.clear();
    history.push("/");
    return true;
  }

  history.push("/");
  return true;
};

export default function Header() {
  const history = useHistory();

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <div className="col-lg-8 col-md-8 col-sm-8">
            <div
              className=" navbar-brand pointer"
              onClick={(e) => goHome(e, history)}
              role="button"
              onKeyDown={(e) => goHome(e, history)}
              tabIndex={0}
            >
              <div className="nav-box">
                <img
                  className="img-fluid d-md-block"
                  src={`${config.REACT_APP_FRONTEND_BASE_URL}/images/bcid-logo-rev-en.svg`}
                  width="200"
                  alt="B.C. Parks Logo"
                />
                <div
                  className="pointer navbar-brand nav-item nav-link nav-title"
                  onClick={(e) => goHome(e, history)}
                  role="button"
                  onKeyDown={(e) => goHome(e, history)}
                  tabIndex={0}
                >
                  BC Parks Staff Portal
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-4">
            <AccountInfo />
          </div>
        </div>
      </nav>
    </header>
  );
}

Header.propTypes = {};
