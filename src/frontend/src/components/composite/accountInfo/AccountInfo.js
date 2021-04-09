import React from "react";
import "./AccountInfo.css";
import { useKeycloak } from "@react-keycloak/web";

const AccountInfo = ({}) => {
  const { keycloak } = useKeycloak();
  return (
    <div>
      {keycloak && keycloak.authenticated && (
        <div>
          <button className="btn" onClick={() => keycloak.logout()}>
            Logout ({keycloak.tokenParsed.preferred_username})
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;
