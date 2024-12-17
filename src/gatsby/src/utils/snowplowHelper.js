export const trackSnowplowEvent = (
  action,
  resultCount = null,
  parkName = null,
  cityName = null,
  label = null,
  filterType = null,
  filterValue = null
) => {
  const filters = {}
  if (filterType && filterValue) {
    filters[filterType] = filterValue
  }
  if (typeof window.snowplow === "function") {
    window.snowplow("trackSelfDescribingEvent", {
      schema: "iglu:ca.bc.gov.bcparks/action/jsonschema/1-0-0",
      data: {
        // Required field: the name of the action
        // Possible values: 'search', 'update_search', 'clear_filters', 'button_click', 'link_click', 'accordion_open', 'accordion_close'
        action: action,
        // Optional field: the number of search results
        result_count: resultCount,
        // Optional field: the park name, if entered
        park_name: parkName,
        // Optional field: the city name, if entered
        city_name: cityName,
        // Optional field: the label for the button or accordion
        label: label,
        // Optional field: filters for the search
        // Possible filters: 'popular', 'area', 'camping', 'activities', 'facilities'
        filters: { ...filters }
      },
    })
  }
}
