// Note: I don't think this template does anything

import React from "react"

import "../../styles/pageContent/pageHeader.scss"


export default function PageHeader({ pageTitle, imageUrl, imageAlt })
{

    return (
       <> 
        <div className="page-header">
            <div className="header-title header-title--desktop d-none d-md-block">
                {pageTitle}
            </div>
                {imageUrl && <div className="header-image-wrapper">
                    <img src={imageUrl} alt={imageAlt ?? ""} />
                </div>}
            <div className="header-title header-title--mobile d-block d-md-none">
                {pageTitle}
            </div>
        </div>


    </>
  )
}