import React, { useState, useEffect } from "react";
import { cmsAxios } from "../../../axios_config";
import { Redirect, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useKeycloak } from "@react-keycloak/web";
import styles from "./AdvisoryDashboard.css";
import { Button } from "../../shared/button/Button";
import DataTable from "../../composite/dataTable/DataTable";
import Select from "react-select";
import Moment from "react-moment";
import { Loader } from "../../shared/loader/Loader";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import LightTooltip from "../../shared/tooltip/LightTooltip";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import EditIcon from "@material-ui/icons/Edit";
import InfoIcon from "@material-ui/icons/Info";
import HelpIcon from "@material-ui/icons/Help";
import ArchiveIcon from "@material-ui/icons/Archive";
import PublishIcon from "@material-ui/icons/Publish";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import { FormControlLabel, Checkbox, SvgIcon } from "@material-ui/core";

import {
  getRegions,
  getManagementAreas,
  getProtectedAreas,
  getAdvisoryStatuses,
  getUrgencies,
} from "../../../utils/CmsDataUtil";

import {
  getLatestPublicAdvisoryAudits,
  updatePublicAdvisories
} from "../../../utils/AdvisoryDataUtil";

export default function AdvisoryDashboard({
  page: { setError, cmsData, setCmsData },
}) {
  const history = useHistory();
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
  const [protectedAreas, setProtectedAreas] = useState([]);
  const [originalProtectedAreas, setOriginalProtectedAreas] = useState([]);
  const [advisoryStatuses, setAdvisoryStatuses] = useState([]);
  const [urgencies, setUrgencies] = useState([]);

  if (!keycloak && !initialized) setToError(true);

  useEffect(() => {
    filterAdvisoriesByRegionId(selectedRegionId);
  }, [selectedRegionId, originalPublicAdvisories]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedParkId !== -1) {
      filterAdvisoriesByParkId(selectedParkId);
    }
  }, [selectedParkId, regionalPublicAdvisories]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preserve filters
  const savedFilters = JSON.parse(localStorage.getItem('advisoryFilters'));
  const defaultPageFilters = [
    { filterName: 'region', filterValue: '', type: 'page' },
    { filterName: 'park', filterValue: '', type: 'page' },
  ];
  const [filters, setFilters] = useState([...(savedFilters || defaultPageFilters)]);

  const archived = sessionStorage.getItem('showArchived') === "true";
  const [showArchived, setShowArchived] = useState(archived);

  useEffect(() => {
    const filters = JSON.parse(localStorage.getItem('advisoryFilters'));
    if (filters) {
      setFilters([...filters]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('advisoryFilters', JSON.stringify(filters));
    sessionStorage.setItem('showArchived', showArchived);
  }, [filters, showArchived]);

  const getTableFilterValue = (col) => {
    return filters.find((obj) => obj.type === 'table' && obj.fieldName === col.field)?.fieldValue || '';
  }

  const getPageFilterValue = (filters, filterName) => {
    return filters.find((obj) => obj.type === 'page' && obj.filterName === filterName)?.filterValue || 0;
  }
  /*-------------------------------------------------------------------------*/

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      if (initialized && keycloak) {
        const filters = JSON.parse(localStorage.getItem('advisoryFilters'));
        const archived = sessionStorage.getItem('showArchived') === "true";
        setShowArchived(archived);
        const res = await Promise.all([
          getRegions(cmsData, setCmsData),
          getManagementAreas(cmsData, setCmsData),
          getProtectedAreas(cmsData, setCmsData),
          getLatestPublicAdvisoryAudits(keycloak, archived)
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
        const protectedAreasData = res[2];
        const publicAdvisories = res[3]?.data.data;
        // Public Advisories
        const updatedPublicAdvisories = updatePublicAdvisories(publicAdvisories, managementAreasData);

        if (isMounted) {
          // Published Advisories
          getCurrentPublishedAdvisories(cmsData, setCmsData);
          setRegions([...regionsData]);
          setManagementAreas([...managementAreasData]);
          setProtectedAreas([...protectedAreasData]);
          setOriginalProtectedAreas([...protectedAreasData]);
          setPublicAdvisories(updatedPublicAdvisories);
          setOriginalPublicAdvisories(updatedPublicAdvisories);

          // Preserve filters
          let regionId = getPageFilterValue(filters, 'region');
          if (regionId) {
            let region = regionsData.find((r) => (r.id === regionId));
            if (region) {
              setSelectedRegionId(regionId);
              setSelectedRegion(({ label: region.regionName + " Region", value: region.id }));
            }
          }

          let parkId = getPageFilterValue(filters, 'park');
          if (parkId) {
            let park = protectedAreasData.find((p) => (p.id === parkId));
            if (park) {
              setSelectedParkId(parkId);
              setSelectedPark(({ label: park.protectedAreaName, value: park.id }));
            }
          }
        }
      }
      setIsLoading(false);
    }
    fetchData();

    return () => {
      isMounted = false;
    }
  }, [
    initialized,
    keycloak,
    cmsData,
    setCmsData,
    setError,
  ]);

  const removeDuplicatesById = (arr) => {
    return arr.filter((obj, index, self) => index === self.findIndex((o) => o.id === obj.id));
  };

  const filterAdvisoriesByParkId = (pId) => {
    const advisories = selectedRegionId ? regionalPublicAdvisories : originalPublicAdvisories;

    if (pId) {
      const filteredPublicAdvsories = [];
      const currentParkObj = protectedAreas.find(o => o.id === pId);
      advisories.forEach((obj) => {
        if (obj.protectedAreas.filter(p => p.id === currentParkObj.id).length > 0) {
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
        return m.region?.id === regId;
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

      setProtectedAreas([...filteredProtectedAreas]);
      setProtectedAreas([...originalProtectedAreas]);
      setPublicAdvisories([...removeDuplicatesById(filteredPublicAdvsories)]);
      setRegionalPublicAdvisories([...removeDuplicatesById(filteredPublicAdvsories)]);
    } else {
      setProtectedAreas([...originalProtectedAreas]);
      setPublicAdvisories([...originalPublicAdvisories]);
      setRegionalPublicAdvisories([...originalPublicAdvisories]);
    }
  };


  const getCurrentPublishedAdvisories = async (cmsData, setCmsData) => {
    const advisoryStatuses = await getAdvisoryStatuses(cmsData, setCmsData);
    const urgencies = await getUrgencies(cmsData, setCmsData);
    setAdvisoryStatuses(advisoryStatuses)
    setUrgencies(urgencies)
    if (advisoryStatuses) {
      const publishedStatus = advisoryStatuses.filter((as) => as.code === "PUB");

      if (publishedStatus?.length > 0) {
        const result = await cmsAxios
          .get(`/public-advisories?filters[advisoryStatus][code]=PUB&fields[0]=advisoryNumber&pagination[limit]=-1&sort=createdAt:DESC`)
          .catch(() => {
            setHasErrors(true);
          });

        let publishedAdvisories = [];
        const res = result?.data?.data;

        if (res.length > 0) {
          res.forEach((ad) => {
            publishedAdvisories = [...publishedAdvisories, ad.advisoryNumber];
          });
        }
        setPublishedAdvisories([...publishedAdvisories]);
      }
    }
  };

  const toggleArchivedAdvisories = async (showArchived) => {
    setShowArchived(showArchived);
    setIsLoading(true);
    setPublicAdvisories([]);

    let res = null;
    try {
      res = await getLatestPublicAdvisoryAudits(keycloak, showArchived)
    } catch {
      setError({ status: 500, message: "Error loading data" });
      setToError(true);
      setIsLoading(false);
    }

    const publicAdvisories = res?.data.data;
    const updatedPublicAdvisories = updatePublicAdvisories(publicAdvisories, cmsData.managementAreas);
    setPublicAdvisories(updatedPublicAdvisories);
    setOriginalPublicAdvisories(updatedPublicAdvisories);
    setIsLoading(false);
  }

  const tableColumns = [
    {
      field: "urgency.urgency",
      title: (
        <Tooltip title="Urgency">
          <WarningRoundedIcon className="warningRoundedIcon" />
        </Tooltip>
      ),
      lookup: urgencies.reduce((lookup, urgency) => {
        lookup[urgency.urgency] = urgency.urgency;
        return lookup;
      }, {}),
      headerStyle: {
        width: 10,
      },
      cellStyle: (e, rowData) => {
        if (rowData.urgency !== null) {
          switch (rowData.urgency?.urgency?.toLowerCase()) {
            case "low":
              return {
                borderLeft: "8px solid #2454a4",
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
      lookup: advisoryStatuses.reduce((lookup, status) => {
        lookup[status.advisoryStatus] = status.advisoryStatus;
        return lookup;
      }, {}),
      customSort: (a, b) => a.archived === b.archived
        ? a.advisoryStatus.advisoryStatus < b.advisoryStatus.advisoryStatus ? -1 : 1
        : a.archived < b.archived ? 1 : -1,
      cellStyle: {
        textAlign: "center",
      },
      render: (rowData) => (
        <div className="advisory-status">
          {rowData.advisoryStatus && !rowData.archived &&
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
          }
          {rowData.archived && (
            <Tooltip title="Archived">
              <span>
                <SvgIcon>
                  <ArchiveIcon className="archivedIcon" />
                </SvgIcon>
              </span>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      field: "advisoryDate",
      title: "Posting date",
      render: (rowData) => {
        if (rowData.advisoryDate)
          return <Moment format="YYYY/MM/DD">{rowData.advisoryDate}</Moment>;
      },
    },
    {
      field: "endDate",
      title: "End date",
      render: (rowData) => {
        if (rowData.endDate) {
          return <Moment format="YYYY/MM/DD">{rowData.endDate}</Moment>;
        }
      },
    },
    {
      field: "expiryDate",
      title: "Expiry date",
      render: (rowData) => {
        if (rowData.expiryDate)
          return <Moment format="YYYY/MM/DD">{rowData.expiryDate}</Moment>;
      },
    },
    {
      field: "title",
      title: "Headline",
      customSort: (a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1,
      headerStyle: { width: 400 },
      cellStyle: { width: 400 },
      render: (rowData) => {
        return <div dangerouslySetInnerHTML={{ __html: rowData.title }}></div>;
      },
    },
    { field: "eventType.eventType", title: "Event type" },
    {
      field: "associatedParks",
      title: "Associated Park(s)",
      headerStyle: { width: 400 },
      cellStyle: { width: 400 },
      render: (rowData) => {
        const displayCount = 3;
        const regionsCount = rowData.regions?.length;
        if (regionsCount > 0) {
          let regions = rowData?.regions?.slice(0, displayCount);
          return (
            <div>
              {regions?.map((p, i) => (
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

        const parksCount = rowData.protectedAreas.length;
        let protectedAreas = rowData.protectedAreas.slice(0, displayCount);
        return (
          <div>
            {protectedAreas.map((p, i) => (
              <span key={i}>
                {p.protectedAreaName}
                {protectedAreas.length - 1 > i && ", "}
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
    return <Redirect to="/create-advisory" />;
  }
  if (toError || hasErrors) {
    console.log('toError || hasErrors', toError, hasErrors)
    return <Redirect push to="/error" />;
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row ad-row">
          <div className="col-lg-6 col-md-4 col-sm-12">
            <h2 className="float-left">Public Advisories</h2>
          </div>
          <div className="col-lg-6 col-md-4 col-sm-12 text-right">
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
          <div className="col-xl-4 col-md-4 col-sm-12">
            <Select
              value={selectedRegion}
              options={regions.map((r) => ({ label: r.regionName + " Region", value: r.id }))}
              onChange={(e) => {
                setSelectedRegion(e);
                setSelectedRegionId(e ? e.value : 0);

                setSelectedPark(null);
                setSelectedParkId(-1); // Do not filter by parkId

                let arr = [...filters.filter((o) => !(o.type === 'page'))];
                setFilters([
                  ...arr,
                  { type: 'page', filterName: 'region', filterValue: e ? e.value : 0 },
                  { type: 'page', filterName: 'park', filterValue: 0 }, // Reset park filter
                ]);
              }}
              placeholder="Select a Region..."
              className="bcgov-select"
              isClearable
            />
          </div>
          <div className="col-xl-5 col-md-4 col-sm-12">
            <Select
              value={selectedPark}
              options={protectedAreas.map((p) => ({ label: p.protectedAreaName, value: p.id }))}
              onChange={(e) => {
                setSelectedPark(e);
                setSelectedParkId(e ? e.value : 0);

                let arr = [...filters.filter((o) => !(o.type === 'page' && o.filterName === 'park'))];
                setFilters([...arr, { type: 'page', filterName: 'park', filterValue: e ? e.value : 0 }]);
              }}
              placeholder="Select a Park..."
              className="bcgov-select"
              isClearable
            />
          </div>
          <div className="col-xl-3 col-md-4 col-sm-12">
            <FormControlLabel className="ml-1" control={
              <Checkbox
                checked={showArchived}
                onChange={(e) => {
                  let showArchived = e ? e.target.checked : false;
                  sessionStorage.setItem('showArchived', showArchived);
                  toggleArchivedAdvisories(showArchived)
                }}
                inputProps={{ "aria-label": "archived" }}
              />
            } label={
              <>
                <small>
                  Show archived
                </small>
                <LightTooltip
                  arrow
                  title="By default, inactive advisories that have not been modified in the past 30 days are hidden. Check this 
                   box to include inactive advisories modified in the past 18 months. Older advisories are available in Strapi.">
                  <HelpIcon className="helpIcon ml-1" />
                </LightTooltip>
              </>
            } />
          </div>
        </div>
      </div>
      {(
        <div
          className={styles.AdvisoryDashboard}
          data-testid="AdvisoryDashboard"
        >
          <br />
          <div className="container-fluid">
            <DataTable
              key={publicAdvisories.length}
              options={{
                filtering: true,
                search: false,
                pageSize: 50,
                pageSizeOptions: [25, 50, publicAdvisories.length],
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
      {isLoading && (
        <div className="page-loader">
          <Loader page />
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