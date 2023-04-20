import React from "react"
import PropTypes from "prop-types";

import "../../styles/pageContent/linkCard.scss"


export default function LinkCard({ url, title, subTitle, imageUrl, imageAltText, buttonText, variation }) {

  let wrapClasses = "" // wrapper is needed for bootstrap layout
  let cardClasses = "card link-card " // to apply direct to card element


  switch (variation) {
    case "Home33Width":
      wrapClasses += "col-12 col-md-4 home-card-wrapper"
      cardClasses += ""
      break;
    case "Home66Width":
      wrapClasses += "col-12 col-md-8 home-card-wrapper"
      cardClasses += ""
      break;
    case "HomeFullWidth":
      wrapClasses += "col-12 home-card-wrapper"
      cardClasses += "link-card--horz"
      break;
    case "Footer": 
      wrapClasses += "col-12 col-md-6 link-card--footer-wrapper"
      cardClasses += "link-card link-card--footer"
      break;
    case "LandingPage":
      cardClasses += "link-card--horz link-card--landing-page"
      break;
    default: 
      cardClasses += ""
      break;
  }
  return (
    <div className={wrapClasses}>
    <a
      className={cardClasses}
      href={url}
      >
      <div className="card-img">
        <img src={imageUrl} alt={imageAltText ?? ""} />
      </div>
      <div className="card-body">
          <h2 className="card-body-header">{title}</h2>
          {subTitle && <div className="card-body-subtitle">{subTitle}</div>}
          {buttonText && <div className="card-button">
            {buttonText} <i className="fa fa-chevron-circle-right"></i>
          </div>}
      </div>
      </a>
    </div>
  )
}

LinkCard.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  imageAltText: PropTypes.string,
};
