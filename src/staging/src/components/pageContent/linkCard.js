import React from "react"
import PropTypes from "prop-types";
import { Link } from "gatsby"
import "../../styles/gridCard.scss"


export default function LinkCard({ url, title, imageUrl, imageAltText }) {
  return (
    <Link
      className="card grid-card grid-card--horz grid-card--light"
      to={url}
    >
      <div className="card-img">
        <img src={imageUrl} alt={imageAltText ?? null} />
      </div>
      <div className="card-body">
        <h5 className="card-body-header">{title}</h5>
        <div className="card-button">
          Learn more <i className="fa fa-chevron-circle-right"></i>
        </div>
      </div>
    </Link>
  )
}

LinkCard.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  imageAltText: PropTypes.string,
};
