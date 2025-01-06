import React from "react"
import { Form } from "react-bootstrap"
import { trackSnowplowEvent } from "../../utils/snowplowHelper"

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

const uniqueId = (id, filterType) => {
  if (filterType === "popular") {
    return `popular-${id}`
  } else {
    return id
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
            id={uniqueId(item.code, filterType)}
            key={uniqueId(item.code, filterType)}
            aria-controls={uniqueId(item.code, filterType)}
            type="checkbox"
            checked={checked}
            onChange={event => {
              handleFilterCheck(item, event)
              trackSnowplowEvent(
                event.target.checked ? "update_search" : "clear_filters",
                item.count,
                null,
                null,
                null,
                filterType,
                item.label
              )
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