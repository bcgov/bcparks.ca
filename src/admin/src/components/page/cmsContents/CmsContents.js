import React, { useState, useEffect } from "react";
import { cmsAxios } from "../../../axios_config";
import Header from "../../composite/header/Header";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import config from "../../../utils/config";

const contentTypes = [
  "access-statuses",
  "activity-types",
  "advisory-statuses",
  "asset-types",
  "event-types",
  "facility-types",
  "fire-ban-prohibitions",
  "fire-centres",
  "fire-zones",
  "link-types",
  "links",
  "management-areas",
  "park-activities",
  "park-facilities",
  "park-name-types",
  "park-names",
  "protected-areas",
  "public-advisories",
  "regions",
  "sections",
  "sites",
  "tokens",
  "urgencies",
  "users",
];

export default function CmsContents() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let urls = [];
    const data = contentTypes;
    data.forEach((contentType) => {
      urls.push(cmsAxios.get(`/${contentType}/count`));
    });

    Promise.allSettled(urls).then((response) => setRows(response));
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="mt-4 mb-4">CMS Contents</h1>
        <table className="table table-hover table-sm border rounded">
          <thead className="thead-light">
            <tr>
              <th scope="col">Content Type</th>
              <th scope="col">Notes</th>
              <th scope="col" className="text-right">
                Record Count
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.status === "fulfilled" && (
                  <>
                    <td>
                      {row.value.data !== 0 && (
                        <CheckCircleIcon
                          style={{ color: "#57a300", fontSize: 14 }}
                        />
                      )}
                      {row.value.data === 0 && (
                        <ErrorIcon style={{ color: "#dbab0a", fontSize: 14 }} />
                      )}{" "}
                      <a
                        href={`${
                          config.REACT_APP_CMS_BASE_URL
                        }${row.value.config.url.replace("/count", "")}`}
                        className="ad-anchor"
                      >
                        {row.value.config.url.split("/", 2)}
                      </a>
                    </td>
                    {row.value.data !== 0 && <td></td>}
                    {row.value.data === 0 && <td color="secondary">no data</td>}
                    <td align="right">{row.value.data}</td>
                  </>
                )}
                {row.status === "rejected" && (
                  <>
                    <td>
                      <CancelRoundedIcon
                        style={{ fontSize: 14 }}
                        color="error"
                      />{" "}
                      {row.reason.config.url.split("/", 2)}
                    </td>
                    <td>{row.reason.message.toLowerCase()}</td>
                    <td align="right">-</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

CmsContents.propTypes = {};

CmsContents.defaultProps = {};
