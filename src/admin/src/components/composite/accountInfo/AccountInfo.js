import React from "react";
import "./AccountInfo.css";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "../../shared/button/Button";
import config from "../../../utils/config";

const AccountInfo = () => {
  const { keycloak } = useKeycloak();
  return (
    keycloak && keycloak.authenticated ? (
      <div className="account-info-box">
        <p>{keycloak.tokenParsed.name}</p>
        <Button
          label="Logout"
          styling="btn"
          onClick={() => {
            keycloak.logout({
              redirectUri: `${config.REACT_APP_FRONTEND_BASE_URL}`,
            });
          }}
        />
      </div>
    ) : <div></div>
  );
};

export default AccountInfo;
