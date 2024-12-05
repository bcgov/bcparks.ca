import React from "react";
import { Link } from "react-router-dom";
import { cmsAxios } from "../../../axios_config";
import DataTable from "../../composite/dataTable/DataTable";
import { Loader } from "../../shared/loader/Loader";
import { useQuery } from "react-query";
import moment from "moment";
import { exportPdf } from "../../../utils/ExportPdfUtil";
import "./ParkAccessStatus.css";

export default function ParkAccessStatus() {
  const formatDate = (date) => {
    return moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : null;
  };

  const fetchParkAccessStatus = async ({ queryKey }) => {
    const response = await cmsAxios.get(
      `/protected-areas/status?limit=-1&sort=protectedAreaName`
    );

    const data = response.data.map((park) => {
      park.managementAreasStr = park.managementAreas.join(", ");
      park.sectionsStr = park.sections.join(", ");
      park.regionsStr = park.regions.join(", ");
      park.fireCentresStr = park.fireCentres.join(", ");
      park.fireZonesStr = park.fireZones.join(", ");
      park.naturalResourceDistrictsStr = park.naturalResourceDistricts.join(", ");
      park.accessStatusEffectiveDate = formatDate(
        park.accessStatusEffectiveDate
      );
      park.campfireBanEffectiveDate = formatDate(park.campfireBanEffectiveDate);
      return park;
    });

    return data;
  };

  const STALE_TIME_MILLISECONDS = 10 * 60 * 1000; // 10 minutes
  const { isLoading, data } = useQuery(
    "parkAccessStatus",
    fetchParkAccessStatus,
    {
      staleTime: STALE_TIME_MILLISECONDS,
    }
  );

  const title = "Park Access Status";
  const exportFilename =
    title.toLowerCase().replaceAll(" ", "-") +
    "-" +
    moment(new Date()).format("YYYYMMDD");

  return (
    <>
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
              exportAllData: true,
              exportFileName: exportFilename,
              exportPdf: (columns, data) =>
                exportPdf(columns, data, title, exportFilename),
              pageSize: 50,
              pageSizeOptions: [25, 50, 100],
            }}
            columns={[
              {
                title: "ORCS",
                field: "orcs",
              },
              { title: "Protected Area Name", field: "protectedAreaName" },
              { title: "Type", field: "type" },
              { title: "Region", field: "regionsStr" },
              { title: "Section", field: "sectionsStr" },
              { title: "Management Area", field: "managementAreasStr" },
              { title: "Fire Centre", field: "fireCentresStr" },
              { title: "Fire Zone", field: "fireZonesStr" },
              { title: "Natural Resource District", field: "naturalResourceDistrictsStr" },
              { title: "Access Status", field: "accessStatus" },
              {
                title: "Access Details",
                field: "accessDetails",
                render: (rowData) => (
                  <Link
                    to={{
                      pathname: `/advisory-summary/${rowData.publicAdvisoryAuditId}`,
                      index: 1,
                    }}
                  >
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
              {
                title: "Campfire Ban Effective Date",
                field: "campfireBanEffectiveDate",
              },
            ]}
            data={data}
            title={title}
          />
        )}
      </div>
    </>
  );
}

ParkAccessStatus.propTypes = {};

ParkAccessStatus.defaultProps = {};
