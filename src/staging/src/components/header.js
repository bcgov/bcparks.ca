import React from "react"
import { Link } from "gatsby"
import MegaMenu from "./megaMenu.js"
import BetaBanner from "../components/betaBanner"
import BCParksLogo from "../images/bcparks-h-rgb-rev.png"
import BCParksWordmark from "../images/BCParks_Wordmark_White.svg"

export default function Header({ content = [] }) {

  return (
    <>
      <BetaBanner></BetaBanner>
      <div className="header-wrapper">
        <nav className="header-nav">
        <Link to="/">
          <img className="bc-parks-logo--desktop d-none d-md-block" alt="BC Parks Logo" src={BCParksLogo} />
          <img className="bc-parks-logo--mobile d-block d-md-none" alt="BC Parks Logo" src={BCParksWordmark}/>
        </Link>
         <a href="https://camping.bcparks.ca" className="btn book-campsite-btn">Book a campsite</a>
        </nav>
      </div> 
      <MegaMenu content={content} menuMode="responsive" />
    </>
  )  
}