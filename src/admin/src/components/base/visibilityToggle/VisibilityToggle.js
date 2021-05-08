import React from "react";
import PropTypes from "prop-types";
import "./VisibilityToggle.css";
import ToggleButton from "@material-ui/lab/ToggleButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

export default function VisibilityToggle({
  toggle: { toggleState, setToggleState },
}) {
  return (
    <div>
      <ToggleButton
        value="check"
        selected={toggleState}
        onChange={() => {
          setToggleState(!toggleState);
        }}
      >
        {toggleState && <VisibilityIcon className="visibilityIcon" />}
        {!toggleState && <VisibilityOffIcon className="visibilityIcon" />}
      </ToggleButton>
    </div>
  );
}

VisibilityToggle.propTypes = {
  toggle: PropTypes.shape({
    toggleState: PropTypes.bool.isRequired,
    setToggleState: PropTypes.func.isRequired,
  }).isRequired,
};
