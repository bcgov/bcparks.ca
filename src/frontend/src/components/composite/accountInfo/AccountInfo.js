import React from "react";
import "./AccountInfo.css";
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "shared-components/build/components/button/Button";

const AccountInfo = ({}) => {
  const { keycloak } = useKeycloak();
  return (
    <div>
      {keycloak && keycloak.authenticated && (
        <div className="account-info-box">
          <p>Welcome, {keycloak.tokenParsed.preferred_username}</p>
          <Button
            label="Logout"
            styling="btn"
            onClick={() => {
              keycloak.logout({ redirectUri: `http://localhost:3000/bcparks` });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AccountInfo;
