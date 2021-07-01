import React from "react";
import PropTypes from "prop-types";
import "./TabPanel.css";
import Box from "@material-ui/core/Box";

export default function TabPanel(props) {
  const { children, value, label, index, ...other } = props;
  return (
    <div
      className={`${label}-tab-content`}
      role="tabpanel"
      hidden={value !== index}
      id={`${label}-${index}`}
      aria-labelledby={`${label}-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  label: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
