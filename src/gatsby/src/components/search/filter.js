import React from "react"
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import CheckIcon from '@mui/icons-material/Check'
import { styled } from '@mui/material/styles'

const CheckboxIcon = styled("span")(() => ({
  borderRadius: 4,
  width: 32,
  height: 32,
  boxShadow: "inset 0 0 0 1px #656565",
  'input:disabled ~ &': {
    boxShadow: "inset 0 0 0 1px #c7c7c7",
  },
}))

const CheckedIcon = styled(CheckIcon)({
  borderRadius: 4,
  width: 32,
  height: 32,
  color: "#fff",
  backgroundColor: "#003366",
})

const shortenFilterLabel = (label) => {
  if (label.includes("-accessible")) {
    return label.replace("-accessible", "")
  } else if (label.includes("camping")) {
    return label.replace("camping", "")
  } else {
    return label
  }
}

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
              icon={<CheckboxIcon />}
              checkedIcon={<CheckedIcon />}
            />
          }
          label={`${shortenFilterLabel(item.label)} (${item.count})`}
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