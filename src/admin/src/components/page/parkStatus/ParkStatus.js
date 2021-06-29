import React from "react";
import { Link } from "react-router-dom";
import { cmsAxios } from "../../../axios_config";
import Moment from "react-moment";
import Header from "../../composite/header/Header";
import DataTable from "../../composite/dataTable/DataTable";
import { useQuery } from "react-query";
import "./ParkStatus.css";
import { Loader } from "shared-components/build/components/loader/Loader";

export default function ParkStatus() {
  const fetchParkStatus = async ({ queryKey }) => {
    const response = await cmsAxios.get(
      `/protected-areas/status?_limit=-1&_sort=protectedAreaName`
    );

    const data = response.data.map((park) => {
      park.managementAreasStr = park.managementAreas.join(", ");
      park.sectionsStr = park.sections.join(", ");
      park.regionsStr = park.regions.join(", ");
      park.fireZonesStr = park.fireZones.map((e) => e.fireZoneName).join(", ");
      return park;
    });

    return data;
  };

  const STALE_TIME_MILLISECONDS = 5 * 60 * 1000; // 5 minutes
  const { isLoading, data } = useQuery("parkStatus", fetchParkStatus, {
    staleTime: STALE_TIME_MILLISECONDS,
  });

  const DEFAULT_PAGE_SIZE = 50;

  return (
    <main>
      {" "}
      <Header
        header={{
          name: "",
        }}
      />
      <br />
      <div id="park-status-container" className="container-fluid">
        <p>{isLoading}</p>
        {isLoading && (
          <div className="page-loader">
            <Loader page />
          </div>
        )}
        {!isLoading && (
          <DataTable
            key={data.length}
            hover
            options={{
              filtering: true,
              search: true,
              exportButton: true,
              pageSize:
                data.length > DEFAULT_PAGE_SIZE
                  ? DEFAULT_PAGE_SIZE
                  : data.length,
              pageSizeOptions: [25, 50, 100],
            }}
            columns={[
              { title: "ORCS", field: "orcs" },
              { title: "Protected Area Name", field: "protectedAreaName" },
              { title: "Type", field: "type" },
              { title: "Code", field: "typeCode" },
              { title: "Park Alias ", field: "protectedAreaNameAliases" },
              { title: "Management Area", field: "managementAreasStr" },
              { title: "Section", field: "sectionsStr" },
              { title: "Region", field: "regionsStr" },
              { title: "Fire Zones", field: "fireZonesStr" },
              { title: "Fog Zone", field: "isFogZone" },
              { title: "Access Status", field: "accessStatus" },
              {
                title: "Access Details",
                field: "accessDetails",
                render: (rowData) => (
                  <Link to={`advisory-summary/${rowData.publicAdvisoryId}`}>
                    {rowData.accessDetails}
                  </Link>
                ),
              },
              {
                title: "Access Status Effective Date",
                field: "accessStatusEffectiveDate",
                render: (rowData) => {
                  if (rowData.accessStatusEffectiveDate)
                    return (
                      <Moment format="YYYY/MM/DD">
                        {rowData.accessStatusEffectiveDate}
                      </Moment>
                    );
                },
              },
              { title: "Camping Facility", field: "hasCampfiresFacility" },
              {
                title: "Reservation Affected",
                field: "isReservationsAffected",
              },
              { title: "Campfire Ban", field: "hasCampfireBan" },
              {
                title: "Campfire Ban Override",
                field: "hasCampfireBanOverride",
              },

              {
                title: "Campfire Ban Effective Date",
                field: "campfireBanEffectiveDate",
                render: (rowData) => {
                  if (rowData.campfireBanEffectiveDate)
                    return (
                      <Moment format="YYYY/MM/DD">
                        {rowData.campfireBanEffectiveDate}
                      </Moment>
                    );
                },
              },
              { title: "Smoking Ban", field: "hasSmokingBan" },
              { title: "Smoking Ban Override", field: "hasSmokingBanOverride" },
            ]}
            data={data}
            title="Park Status"
          />
        )}
      </div>
    </main>
  );
}

ParkStatus.propTypes = {};

ParkStatus.defaultProps = {};
