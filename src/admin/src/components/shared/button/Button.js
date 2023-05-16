import React from "react";
import PropTypes from "prop-types";
import { Loader } from "../loader/Loader";
import "./Button.css";

export const Button = ({
  hasLoader,
  onClick,
  label,
  styling,
  disabled,
  testId,
}) => (
  <button
    className={`bcgov-button ${styling}`}
    onClick={onClick}
    type="button"
    disabled={disabled}
    data-test-id={testId}
  >
    {label}
    {hasLoader && (
      <div className="bcgov-loader-show">
        <Loader />
      </div>
    )}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string.isRequired,
  styling: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  testId: PropTypes.string,
  hasLoader: PropTypes.bool,
};

Button.defaultProps = {
  disabled: false,
  testId: "",
  hasLoader: false,
  onClick: () => {},
};
