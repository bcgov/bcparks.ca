export const trackSnowplowEvent = (
  action,
  resultCount = null,
  parkName = null,
  cityName = null,
  label = null,
  url = null,
  filters = null
) => {
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
        // Optional field: the url for the link
        url: url,
        // Optional field: filters for the search
        // Possible filters: 'popular', 'area', 'camping', 'activities', 'facilities'
        filters: filters,
      },
    })
  }
}

// convert filter array to object
export const transformFilters = filters => {
  return filters.reduce((acc, filter) => {
    if (!acc[filter.type]) {
      acc[filter.type] = []
    }
    acc[filter.type].push(filter.label)

    // check for "Popular" filters
    if (
      (filter.type === "Camping" && [1, 36].includes(filter.value)) ||
      (filter.type === "Things to do" && [1, 3, 8, 9].includes(filter.value)) ||
      (filter.type === "Facilities" && filter.value === 6)
    ) {
      if (!acc["Popular"]) {
        acc["Popular"] = []
      }
      acc["Popular"].push(filter.label)
    }
    return acc
  }, {})
}
