import React from "react"
import { Form } from "react-bootstrap"

const shortenFilterLabel = (label, filterType) => {
  if (filterType === "popular") {
    if (label.includes("-accessible")) {
      return label.replace("-accessible", "")
    } else {
      return label
    }
  } else {
    if (label.includes("-accessible camping")) {
      return label.replace("-accessible camping", "")
    } else if (label.includes("camping")) {
      return label.replace("camping", "")
    } else {
      return label
    }
  }
}

const Filter = ({ filterItems, selectedFilterItems, handleFilterCheck, filterType }) => {
  return (
    <Form.Group className="filter-options-container">
      {filterItems.map(item => {
        const checked = selectedFilterItems.filter(
          selectedFilterItem =>
            selectedFilterItem.value === item.value
        ).length === 1 ? true : false
        return (
          <Form.Check
            id={item.label}
            key={item.label}
            type="checkbox"
            checked={checked}
            onChange={event => {
              handleFilterCheck(item, event)
              if (typeof window.snowplow === 'function') {
                window.snowplow(
                  // function
                  "trackStructEvent",
                  // category
                  "park-search",
                  // action
                  event.target.checked ? "select-filter" : "unselect-filter",
                  // label
                  `${item.filterType} - ${item.label}`,
                  // property
                  "filter-type"
                )
              }
            }}
            label={`${shortenFilterLabel(item.label, filterType)} (${item.count})`}
            className={
              selectedFilterItems.filter(
                selectedFilterItem => selectedFilterItem.value === item.value
              ).length === 1 ? "text-light-blue" : ""
            }
            disabled={item.count === 0 && !checked}
          />
        )
      })}
    </Form.Group>
  )
}

export default Filter