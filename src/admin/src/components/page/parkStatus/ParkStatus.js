import React from "react";
import { Link } from "react-router-dom";
import { cmsAxios } from "../../../axios_config";
import Header from "../../composite/header/Header";
import DataTable from "../../composite/dataTable/DataTable";
import { Loader } from "shared-components/build/components/loader/Loader";
import { useQuery } from "react-query";
import moment from "moment";
import { exportPdf } from "../../../utils/ExportPdfUtil";
import "./ParkStatus.css";

export default function ParkStatus() {
  const formatDate = (date) => {
    return moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : null;
  };

  const fetchParkStatus = async ({ queryKey }) => {
    const response = await cmsAxios.get(
      `/protected-areas/status?_limit=-1&_sort=protectedAreaName`
    );

    const data = response.data.map((park) => {
      park.managementAreasStr = park.managementAreas.join(", ");
      park.sectionsStr = park.sections.join(", ");
      park.regionsStr = park.regions.join(", ");
      park.fireCentresStr = park.fireCentres.join(", ");
      park.fireZonesStr = park.fireZones.join(", ");
      park.accessStatusEffectiveDate = formatDate(
        park.accessStatusEffectiveDate
      );
      park.campfireBanEffectiveDate = formatDate(park.campfireBanEffectiveDate);
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
              exportPdf: (columns, data) =>
                exportPdf(columns, data, "Park Access Status"),
              pageSize:
                data.length > DEFAULT_PAGE_SIZE
                  ? DEFAULT_PAGE_SIZE
                  : data.length,
              pageSizeOptions: [25, 50, 100],
            }}
            columns={[
              {
                title: "ORCS",
                field: "orcs",
              },
              { title: "Protected Area Name", field: "protectedAreaName" },
              { title: "Type", field: "type" },
              { title: "Code", field: "typeCode", export: false },
              {
                title: "Park Alias ",
                field: "protectedAreaNameAliases",
                export: false,
              },
              { title: "Region", field: "regionsStr" },
              { title: "Section", field: "sectionsStr" },
              { title: "Management Area", field: "managementAreasStr" },
              { title: "Fire Centre", field: "fireCentresStr" },
              { title: "Fire Zone", field: "fireZonesStr" },
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
              },
              { title: "Campfire Facility", field: "hasCampfiresFacility" },
              {
                title: "Reservations Affected",
                field: "isReservationsAffected",
              },
              {
                title: "Campfire Ban",
                field: "hasCampfireBan",
              },
              { title: "Smoking Ban", field: "hasSmokingBan" },
              {
                title: "Campfire Ban Effective Date",
                field: "campfireBanEffectiveDate",
              },
              {
                title: "Campfire Ban Override",
                field: "hasCampfireBanOverride",
                export: false,
              },
              {
                title: "Smoking Ban Override",
                field: "hasSmokingBanOverride",
                export: false,
              },
            ]}
            data={data}
            title="Park Access Status"
          />
        )}
      </div>
    </main>
  );
}

ParkStatus.propTypes = {};

ParkStatus.defaultProps = {};
