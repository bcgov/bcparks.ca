import React, { useState, useEffect, useRef } from "react";
import { cmsAxios } from "../../../axios_config";
import { Redirect, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useKeycloak } from "@react-keycloak/web";
import styles from "./AdvisoryDashboard.css";
import { Button } from "shared-components/build/components/button/Button";
import DataTable from "../../composite/dataTable/DataTable";
import Select from "react-select";
import Moment from "react-moment";
import moment from "moment";
import { Loader } from "shared-components/build/components/loader/Loader";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import TimerIcon from "@material-ui/icons/Timer";
import Tooltip from "@material-ui/core/Tooltip";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import EditIcon from "@material-ui/icons/Edit";
import InfoIcon from "@material-ui/icons/Info";
import PublishIcon from "@material-ui/icons/Publish";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import { SvgIcon } from "@material-ui/core";
import { decode } from "he";

import {
  getRegions,
  getManagementAreas,
  getParkNames,
  getAdvisoryStatuses,
} from "../../../utils/CmsDataUtil";

export default function AdvisoryDashboard({
  page: { setError, cmsData, setCmsData },
}) {
  const history = useHistory();
  const isMounted = useRef(true);
  const { keycloak, initialized } = useKeycloak();
  const [toError, setToError] = useState(false);
  const [toCreate, setToCreate] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedParkId, setSelectedParkId] = useState(0);
  const [selectedPark, setSelectedPark] = useState(null);
  const [publishedAdvisories, setPublishedAdvisories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [originalPublicAdvisories, setOriginalPublicAdvisories] = useState([]);
  const [regionalPublicAdvisories, setRegionalPublicAdvisories] = useState([]);
  const [publicAdvisories, setPublicAdvisories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [managementAreas, setManagementAreas] = useState([]);
  const [parkNames, setParkNames] = useState([]);
  const [originalParkNames, setOriginalParkNames] = useState([]);

  if (!keycloak && !initialized) setToError(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  useEffect(() => {
    filterAdvisoriesByRegionId(selectedRegionId);
  }, [selectedRegionId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedParkId !== -1) {
      filterAdvisoriesByParkId(selectedParkId);
    }
  }, [selectedParkId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preserve filters
  const defaultPageFilters = [
    { filterName: 'region', filterValue: '', type: 'page'},
    { filterName: 'park', filterValue: '', type: 'page'}
  ];
  const [filters, setFilters] = useState([...defaultPageFilters]);

  useEffect(() => {
    const filters = JSON.parse(localStorage.getItem('advisoryFilters'));
    if (filters) {
      setFilters([...filters]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('advisoryFilters', JSON.stringify(filters));
  }, [filters]);

  const getTableFilterValue = (col) => {
    return filters.find((obj) => obj.type === 'table' && obj.fieldName === col.field)?.fieldValue || '';
  }

  const getPageFilterValue = (filters, filterName) => {
    return filters.find((obj) => obj.type === 'page' && obj.filterName === filterName)?.filterValue || 0;
  }
  /*-------------------------------------------------------------------------*/

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (initialized && keycloak) {
        const res = await Promise.all([
          getRegions(cmsData, setCmsData),
          getManagementAreas(cmsData, setCmsData),
          getParkNames(cmsData, setCmsData),
          cmsAxios.get(`public-advisory-audits?_limit=1500&_sort=advisoryDate:DESC`, { headers: { Authorization: `Bearer ${keycloak.token}` } })
        ])
        .catch(() => {
          setError({ status: 500, message: "Error loading data" });
          setToError(true);
          setIsLoading(false);
        });
        // Regions
        const regionsData = res[0];

        // Management Areas
        const managementAreasData = res[1];

        // Protected Areas
        const parkNamesData = res[2];

        // Public Advisories
        const regionParksCount = managementAreasData.reduce((region, item) => {
          region[item.region.id] = (region[item.region.id] || 0) + item.protectedAreas.length;
          return region;
        }, {});

        const publicAdvisories = res[3].data;
        const today = moment(new Date()).tz("America/Vancouver").toISOString();
        const updatedPublicAdvisories = publicAdvisories.map((publicAdvisory) => {
          publicAdvisory.expired = publicAdvisory.expiryDate < today ? "Y" : "N";
          publicAdvisory.associatedParks = publicAdvisory.protectedAreas.map((p) => p.protectedAreaName).join(", ")
            + publicAdvisory.regions.map((r) => r.regionName).join(", ");
    
          let regionsWithParkCount = [];
          if (publicAdvisory?.regions?.length > 0) {
            publicAdvisory.regions.forEach((region) => {
              region.count = regionParksCount[region.id];
              regionsWithParkCount = [...regionsWithParkCount, region];
            });
            publicAdvisory.regions = regionsWithParkCount;
          }
          return publicAdvisory;
        });

        // Published Advisories
        getCurrentPublishedAdvisories(cmsData, setCmsData);

        if (isMounted.current) {
          setRegions([...regionsData]);
          setManagementAreas([...managementAreasData]);

          setParkNames([...parkNamesData]);
          setOriginalParkNames([...parkNamesData]);

          setPublicAdvisories(updatedPublicAdvisories);
          setOriginalPublicAdvisories(updatedPublicAdvisories);

          // Preserve filters
          let filters = JSON.parse(localStorage.getItem('advisoryFilters'));
          let regionId = getPageFilterValue(filters, 'region');
          if (regionId) {
            let region = regionsData.find((r) => (r.id === regionId));
            setSelectedRegionId(regionId);
            setSelectedRegion(({ label: region.regionName + " Region", value: region.id }));
          }

          let parkId = getPageFilterValue(filters, 'park');
          if (parkId) {
            let park = parkNamesData.find((p) => (p.id === parkId));
            setSelectedParkId(parkId);
            setSelectedPark(({ label: park.parkName, value: park.id }));
          }
        }
      }
      setIsLoading(false);
    }
    fetchData();
  }, [
    initialized,
    keycloak,
    cmsData,
    setCmsData,
    setError
  ]);

  const removeDuplicatesById = (arr) => {
    return arr.filter((obj, index, self) => index === self.findIndex((o) => o.id === obj.id));
  };
  
  const filterAdvisoriesByParkId = (pId) => {
    const advisories = selectedRegionId ? regionalPublicAdvisories : originalPublicAdvisories;

    if (pId) {
      const filteredPublicAdvsories = [];
      const currentParkObj = parkNames.find(o => o.protectedArea?.id === pId);

      advisories.forEach((obj) => {
        if (obj.protectedAreas.filter(p => p.id === currentParkObj.protectedArea.id).length > 0) {
          filteredPublicAdvsories.push(obj);
        }
      });
      setPublicAdvisories([...filteredPublicAdvsories]);
    }
    else {
      setPublicAdvisories([...advisories]);
    }
  };

  const filterAdvisoriesByRegionId = (regId) => {
    if (regId) {
      const filteredManagementAreas = managementAreas.filter((m) => {
        return m.region.id === regId;
      });

      // Filter park names dropdown list
      let list = [];
      filteredManagementAreas.forEach((obj) => {
        list = [...list.concat(obj.protectedAreas)];
      });

      // Remove duplicates
      const filteredProtectedAreas = removeDuplicatesById(list);
      
      // Filter advisories in grid
      const filteredPublicAdvsories = [];

      originalPublicAdvisories.forEach((obj) => {
        obj.protectedAreas.forEach(p => {
          let idx = filteredProtectedAreas.findIndex(o => o?.orcs === p?.orcs);
          if (idx !== -1) {
            filteredPublicAdvsories.push(obj);
          }
        });
      });

      // Filter park names in dropdown options
      const filteredParkNames = [];
      originalParkNames.forEach((p) => {
        let idx = filteredProtectedAreas.findIndex(o => o?.orcs === p?.protectedArea?.orcs);
        if (idx !== -1) {
          filteredParkNames.push(p);
        }
      });

      setParkNames([...filteredParkNames]);
      setPublicAdvisories([...removeDuplicatesById(filteredPublicAdvsories)]);
      setRegionalPublicAdvisories([...removeDuplicatesById(filteredPublicAdvsories)]);
    } else {
      setParkNames([...originalParkNames]);
      setPublicAdvisories([...originalPublicAdvisories]);
      setRegionalPublicAdvisories([...originalPublicAdvisories]);
    }
  };

  const getCurrentPublishedAdvisories = async (cmsData, setCmsData) => {
    const advisoryStatuses = await getAdvisoryStatuses(cmsData, setCmsData);
    if (advisoryStatuses) {
      const publishedStatus = advisoryStatuses.filter((as) => as.code === "PUB");
      if (publishedStatus?.length > 0) {
        const result = await cmsAxios
          .get(`/public-advisories?_advisoryStatus=${publishedStatus[0].id}&_limit=-1`)
          .catch(() => {
            setHasErrors(true);
          });

        let publishedAdvisories = [];
        if (result?.data?.length > 0) {
          result.data.forEach((ad) => {
            publishedAdvisories = [...publishedAdvisories, ad.advisoryNumber];
          });
        }
        if (isMounted.current) {
          setPublishedAdvisories([...publishedAdvisories]);
        }
      }
    }
  };

  const tableColumns = [
    {
      field: "urgency.urgency",
      title: (
        <Tooltip title="Urgency">
          <WarningRoundedIcon className="warningRoundedIcon" />
        </Tooltip>
      ),
      headerStyle: {
        width: 10,
      },
      cellStyle: (e, rowData) => {
        if (rowData.urgency !== null) {
          switch (rowData.urgency.urgency.toLowerCase()) {
            case "low":
              return {
                borderLeft: "8px solid #06f542",
              };
            case "medium":
              return {
                borderLeft: "8px solid #f5d20e",
              };
            case "high":
              return {
                borderLeft: "8px solid #f30505",
              };
            default:
              return {};
          }
        }
      },
      render: (rowData) => {
        return (
          <>
            <Tooltip
              title={
                rowData.urgency ? rowData.urgency.urgency : "Urgency not set"
              }
            >
              <div className="urgency-column">&nbsp;</div>
            </Tooltip>
          </>
        );
      },
    },
    {
      field: "advisoryStatus.advisoryStatus",
      title: "Status",
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => (
        <div className="advisory-status">
          {rowData.advisoryStatus && (
            <Tooltip title={rowData.advisoryStatus.advisoryStatus}>
              <span>
                {publishedAdvisories.includes(rowData.advisoryNumber) && (
                  <SvgIcon>
                    {rowData.advisoryStatus.code !== "PUB" && (
                      <PublishIcon
                        className="publishedIcon"
                        viewBox="5 13 25 5"
                      />
                    )}
                    {rowData.advisoryStatus.code === "DFT" && (
                      <EditIcon className="draftIcon" viewBox="-16 -5 45 10" />
                    )}
                    {rowData.advisoryStatus.code === "INA" && (
                      <WatchLaterIcon
                        className="inactiveIcon"
                        viewBox="-16 -5 45 10"
                      />
                    )}
                    {rowData.advisoryStatus.code === "APR" && (
                      <ThumbUpIcon
                        className="approvedIcon"
                        viewBox="-16 -5 45 10"
                      />
                    )}
                    {rowData.advisoryStatus.code === "ARQ" && (
                      <InfoIcon
                        className="approvalRequestedIcon"
                        viewBox="-16 -5 45 10"
                      />
                    )}
                    {rowData.advisoryStatus.code === "PUB" && (
                      <PublishIcon className="publishedIcon" />
                    )}
                  </SvgIcon>
                )}
                {!publishedAdvisories.includes(rowData.advisoryNumber) && (
                  <>
                    {rowData.advisoryStatus.code === "DFT" && (
                      <EditIcon className="draftIcon" />
                    )}
                    {rowData.advisoryStatus.code === "INA" && (
                      <WatchLaterIcon className="inactiveIcon" />
                    )}
                    {rowData.advisoryStatus.code === "APR" && (
                      <ThumbUpIcon className="approvedIcon" />
                    )}
                    {rowData.advisoryStatus.code === "ARQ" && (
                      <InfoIcon className="approvalRequestedIcon" />
                    )}
                    {rowData.advisoryStatus.code === "PUB" && (
                      <PublishIcon className="publishedIcon" />
                    )}
                  </>
                )}
              </span>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      field: "advisoryDate",
      title: "Posted Date",
      render: (rowData) => {
        if (rowData.advisoryDate)
          return <Moment format="YYYY/MM/DD">{rowData.advisoryDate}</Moment>;
      },
    },
    {
      field: "title",
      title: "Headline",
      headerStyle: { width: 400 },
      cellStyle: { width: 400 },
      render: (rowData) => {
        return <div dangerouslySetInnerHTML={{ __html: rowData.title }}></div>;
      },
    },
    { field: "eventType.eventType", title: "Event Type" },
    {
      field: "effectiveDate",
      title: "Start Date",
      render: (rowData) => {
        if (rowData.effectiveDate)
          return <Moment format="YYYY/MM/DD">{rowData.effectiveDate}</Moment>;
      },
    },
    {
      field: "endDate",
      title: "End Date",
      render: (rowData) => {
        if (rowData.endDate) {
          return (
            <div className="text-nowrap">
              <Moment format="YYYY/MM/DD">{rowData.endDate}</Moment>
              {rowData.expiryDate && (
                <Tooltip
                  title={
                    <span>
                      This advisory will be removed on{" "}
                      <Moment format="YYYY/MM/DD">{rowData.expiryDate}</Moment>
                    </span>
                  }
                >
                  <TimerIcon color="primary" />
                </Tooltip>
              )}
            </div>
          );
        }
      },
    },
    {
      field: "expired",
      title: "Expired",
      render: (rowData) => {
        return (
          <>
            {rowData.expired === "Y" && (
              <Tooltip
                title={
                  <span>
                    Expired on{" "}
                    <Moment format="YYYY/MM/DD">{rowData.expiryDate}</Moment>
                  </span>
                }
              >
                <Chip size="small" label={rowData.expired} />
              </Tooltip>
            )}
          </>
        );
      },
    },
    {
      field: "associatedParks",
      title: "Associated Park(s)",
      headerStyle: { width: 400 },
      cellStyle: { width: 400 },
      render: (rowData) => {
        const displayCount = 3;
        const regionsCount = rowData.regions.length;
        if (regionsCount > 0) {
          let regions = rowData.regions.slice(0, displayCount);
          return (
            <div>
              {regions.map((p, i) => (
                <span key={i}>
                  {p.regionName} region
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${p.count} parks`}
                  />
                </span>
              ))}
              {regionsCount > displayCount && (
                <Tooltip
                  title={`plus ${regionsCount - displayCount} more region(s)`}
                >
                  <Chip
                    size="small"
                    label={`+${regionsCount - displayCount}`}
                  />
                </Tooltip>
              )}
            </div>
          );
        }

        const rowParkNames = [];
        originalParkNames.filter(pn => pn.parkNameType.nameType === "Escaped").forEach((p) => {
          let idx = rowData.protectedAreas.findIndex(o => o?.orcs === p?.protectedArea?.orcs);
          if (idx !== -1 && p.parkNameType.nameType === "Escaped") {
            rowParkNames.push(p);
          }
        });

        let parksCount = rowParkNames.length;
        let parkNames = rowParkNames.slice(0, displayCount);
        return (
          <div>
            {parkNames.map((p, i) => (
              <span key={i}>
                <span dangerouslySetInnerHTML={{ __html: p.parkName }} />
                {parkNames.length - 1 > i && ", "}
              </span>
            ))}
            {parksCount > displayCount && (
              <Tooltip title={`plus ${parksCount - displayCount} more park(s)`}>
                <Chip size="small" label={`+${parksCount - displayCount}`} />
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: "",
      field: "id",
      filtering: false,
      headerStyle: {
        width: 10,
        maxWidth: 10,
        minWidth: 10,
      },
      cellStyle: {
        width: 10,
        maxWidth: 10,
        minWidth: 10,
        textAlign: "right",
        paddingRight: "10px",
      },
      render: (rowData) => (
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  if (toCreate) {
    return <Redirect to="/bcparks/create-advisory" />;
  }

  if (toError || hasErrors) {
    return <Redirect push to="/bcparks/error" />;
  }

  return (
    <>
      <br />
      {isLoading && (
        <div className="page-loader">
          <Loader page />
        </div>
      )}
      {!isLoading && (
        <div
          className={styles.AdvisoryDashboard}
          data-testid="AdvisoryDashboard"
        >
          <div className="container-fluid">
            <div className="row ad-row">
              <div className="col-lg-6 col-md-4 col-sm-12 ad-label">
                <h2 className="float-left">Public Advisories</h2>
              </div>
              <div className="col-lg-6 col-md-4 col-sm-12 ad-label">
                <Button
                  label="Create a new Advisory"
                  styling="bcgov-normal-yellow btn"
                  onClick={() => {
                    sessionStorage.clear();
                    setToCreate(true);
                  }}
                />
              </div>
            </div>
            <div className="row ad-row">
              <div className="col-lg-6 col-md-4 col-sm-12">
                <Select
                  value={selectedRegion}
                  options={regions.map((r) => ({ label: r.regionName + " Region", value: r.id }) )}
                  onChange={(e) => {
                    setSelectedRegion(e);
                    setSelectedRegionId(e ? e.value : 0);

                    setSelectedPark(null);
                    setSelectedParkId(-1); // Do not filter by parkId

                    let arr = [...filters.filter((o) => !(o.type === 'page'))];
                    setFilters([
                      ...arr,
                      {type: 'page', filterName: 'region', filterValue: e ? e.value : 0},
                      {type: 'page', filterName: 'park', filterValue: 0}, // Reset park filter
                    ]);
                  }}
                  placeholder="Select a Region..."
                  className="bcgov-select"
                  isClearable
                />
              </div>
              <div className="col-lg-6 col-md-4 col-sm-12">
                <Select
                  value={selectedPark}
                  options={parkNames
                    .filter(pn => pn.parkNameType.nameType === "Escaped")
                    .map(p => ({
                      label: decode(p.parkName).replace(/(<([^>]+)>)/gi, ""),
                      value: p.protectedArea?.id
                    }))}
                  onChange={(e) => {
                    setSelectedPark(e);
                    setSelectedParkId(e ? e.value : 0);

                    let arr = [...filters.filter((o) => !(o.type === 'page' && o.filterName === 'park'))];
                    setFilters([...arr, {type: 'page', filterName: 'park', filterValue: e ? e.value : 0}]);
                  }}
                  placeholder="Select a Park..."
                  className="bcgov-select"
                  isClearable
                />
              </div>
            </div>
          </div>
          <br />
          <div className="container-fluid">
            <DataTable
              key={publicAdvisories.length}
              options={{
                filtering: true,
                search: false,
                pageSize: 50,
                pageSizeOptions: [25, 50, 100],
              }}
              onFilterChange={(filters) => {
                const advisoryFilters = JSON.parse(localStorage.getItem('advisoryFilters'));
                const arrFilters = filters.map((obj) => {
                  return { 
                    fieldName: obj.column["field"],
                    fieldValue: obj.value,
                    type: 'table'
                  };
                });
                setFilters([...advisoryFilters.filter(o => o.type === 'page'), ...arrFilters]);
              }}
              columns={tableColumns.map((col) => ({ ...col, defaultFilter: getTableFilterValue(col) }))}
              data={publicAdvisories}
              title=""
              onRowClick={(event, rowData) => {
                history.push(`advisory-summary/${rowData.id}`);
              }}
              components={{
                Toolbar: (props) => <div></div>,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

AdvisoryDashboard.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    cmsData: PropTypes.object.isRequired,
    setCmsData: PropTypes.func.isRequired,
  }).isRequired,
};
