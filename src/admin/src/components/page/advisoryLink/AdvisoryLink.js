import React, { useEffect } from "react";
import { cmsAxios } from "../../../axios_config";
import { useParams, useHistory } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

/* 
  This component is used with React Router to create email redirect links to the
  advisory-summary page based on advisoryNumber instead of publicAdvisoryAuditId 
*/
export default function AdvisoryLink() {
  const history = useHistory();
  const { keycloak } = useKeycloak();
  const { advisoryNumber } = useParams();

  useEffect(() => {
    if (parseInt(advisoryNumber)) {
      Promise.resolve(
        cmsAxios.get(`public-advisory-audits?filters[advisoryNumber]=${advisoryNumber}&filters[isLatestRevision]=true&publicationState=preview`,
          {
            headers: { Authorization: `Bearer ${keycloak.token}` }
          }),
      )
        .then((res) => {
          history.replace(`/bcparks/advisory-summary/${res.data.data[0].id}`);
        })
        .catch((err) => {
          history.replace(`/bcparks/dashboard`);
        });
    }
  }, [
    advisoryNumber,
    keycloak,
    history
  ]);

  return (
    <div>Loading advisory...</div>
  );
};


