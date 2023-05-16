import React from "react";
import PropTypes from "prop-types";
import "./Loader.css";

export const Loader = ({ page }) => {
  let loaderCss = "bcgov-btn-loader";
  if (page) loaderCss = "bcgov-page-loader";

  return (
    <>
      <div className={loaderCss} />
      {page && (
        <>
          <br />
          Loading... Please Wait
        </>
      )}
    </>
  );
};

Loader.propTypes = {
  page: PropTypes.bool,
};

Loader.defaultProps = {
  page: false,
};
