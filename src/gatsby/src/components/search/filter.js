import React from "react"
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material"

const Filter = ({ filterItems, selectedFilterItems, handleFilterCheck }) => {
  return (
    <FormGroup className="filter-options-container">
      {filterItems.map(item => {
        const checked = selectedFilterItems.filter(
          selectedFilterItem =>
            selectedFilterItem.value === item.value
        ).length === 1 ? true : false
        return (<FormControlLabel
          key={item.label}
          control={
            <Checkbox
              checked={checked}
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
            ).length === 1 ? "text-light-blue" : ""
          }
          disabled={item.count === 0 && !checked}
        />)
      }
      )}
    </FormGroup>
  )
}

export default Filter