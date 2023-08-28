import React from "react"
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material"

const Filter = ({ filterItems, selectedFilterItems, handleFilterCheck }) => {
  return (
    <FormGroup className="filter-options-container">
      {filterItems.map(item =>
        <FormControlLabel
          key={item.label}
          control={
            <Checkbox
              checked={
                selectedFilterItems.filter(
                  selectedFilterItem =>
                    selectedFilterItem.value === item.value
                ).length === 1 ? true : false
              }
              onChange={event => {
                handleFilterCheck(item, event)
              }}
              name={item.label}
            />
          }
          label={`${item.label} (${item.count})`}
          className={
            selectedFilterItems.filter(
              selectedFilterItem =>
                selectedFilterItem.value === item.value
            ).length === 1 && "text-light-blue"
          }
          disabled={item.count === 0}
        />
      )}
    </FormGroup>
  )
}

export default Filter