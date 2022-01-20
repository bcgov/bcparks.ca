import React, { useState } from "react"
import {
  Grid,
  Box,
  InputLabel,
  TextField
} from "@material-ui/core"

import SearchIcon from "@material-ui/icons/Search"
import bcParksWordmark from "../images/BCParks_Wordmark_White.svg"
import facebookIcon from "../images/Facebook_Negative.svg"
import instaIcon from "../images/Instagram_Negative.svg"

import "../styles/global.scss"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  logoContainer: {
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
    },
  },
  logo: {
    [theme.breakpoints.up("sm")]: {
      height: "90px",
    },
    [theme.breakpoints.down("sm")]: {
      height: "40px",
    },
  },
  menuList: {
    paddingTop: "10px",
    listStyle: "none",
    paddingLeft: "20px",
    [theme.breakpoints.up("md")]: {
      fontSize: "1.05rem"
    },
  },
  menu2: {
    // need to reorder 2 and 3 in mobile to keep
    // "stay connected" close to social buttons
    [theme.breakpoints.down("md")]: {
      order: 3,
    },
    [theme.breakpoints.up("md")]: {
      order: 2,
    },
  },
  menu3: {
    [theme.breakpoints.down("md")]: {
      order: 2,
    },
    [theme.breakpoints.up("md")]: {
      order: 3,
    },
  },
  menu4: {
    order: 4,
  },
  menuHeader: {
    fontWeight: "bold",
    color: "#fff",
  },
  menuDivider: {
    marginTop: "1rem",
    marginBottom: "5px",
    height: "1px",
    backgroundColor: "#fcba19",
    width: "48px",
  },
  menuItem: {
    marginTop: "10px",
  },
  socialIcons: {
    textAlign: "left",
    [theme.breakpoints.up("md")]: {
      marginLeft: "auto",
      width: "33%",
    },
  },
  socialIcon: {
    display: "inline-block",
    marginTop: "4px",
    marginLeft: "20px",
  },
  utilityMenu: {
    display: "block",
    textAlign: "center",
    paddingTop: "15px",
    marginTop: "60px",
    borderTop: "solid 1px #fff",
    paddingBottom: "20px",
    [theme.breakpoints.up("md")]: {
      textAlign: "left",
    },
  },
  utilityLink: {
    fontSize: "0.8rem",
    margin: "0 10px",
    display: "inline-block",
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
      margin: "20px 40px 10px 0px",
    },
  },
  searchBoxContainer: {
    margin: "10px 20px 25px 20px",
    "& .MuiInputLabel-root": {
      display: "none",
    },
  },
  searchBox: {
    lineHeight: "50px",
    height: "50px",
    width: "100%",
    maxWidth: "445px",
    color: "#fff",
    paddingLeft: "20px",
    borderRadius: "25px",
    alignItems: "center",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      margin: "0 auto",
    },
    "& .MuiFormControl-root": { // needed so dynamic underline spans area
      width: "100%",
    },
    "& input": { // needed to make basic input styling invisible
      background: "none",
      height: "40px",
      color: "#fff",
      fontFamily: "BC Sans, Verdana, Arial, sans serif",
      fontSize: "1rem",
      "&::placeholder": {
        color: "#fff",
        opacity: 1,
      },
    },
  },
  searchInput: {
    fontSize: "0.75rem",
    width: "80%",
  },
  searchIcon: {
    marginLeft: "auto",
    marginRight: "10px",
  },
  searchMsg: {
    color: "#fff",
    fontSize: "0.75rem",
    fontStyle: "italic",
    textAlign: "center",

    [theme.breakpoints.down("md")]: {
      borderBottom: "solid 1px rgba(255,255,255,0.3)",
      marginBottom: "20px",
      paddingBottom: "10px",
      margin: "-15px 40px 0px 40px",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: "400px",
      borderBottom: "none",
      margin: "-15px 0px 0px 20px",
    },
  },
}))

function FooterMenu({ items }) {
  const classes = useStyles()

  return (
    <>
      <ul className={classes.menuList}>
        {items.map((item, index) => (
          <li key={index}>
            {item.type === "header" && (
              <>
                <div className={classes.menuHeader}>{item.display}</div>
                <div className={classes.menuDivider}>&nbsp;</div>
              </>
            )}
            {item.type === "link" && (
              <>
                <div key={index} className={classes.menuItem}>
                  <a href={item.link}>{item.display}</a>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

export default function Footer() {
  const classes = useStyles()

  // Arrays of footer menus
  // TODO replace with data from Strapi
  const menu1 = [
    { type: "header", display: "Get a permit" },
    { type: "link", display: "Commercial services", link: "/permits" },
  ]
  const menu2 = [
    { type: "header", display: "Get involved" },
    { type: "link", display: "Volunteer", link: "/volunteers" },
    { type: "link", display: "Support BC Parks", link: "/volunteers" },
  ]
  const menu3 = [
    { type: "header", display: "Stay connected" },
    { type: "link", display: "Contact us", link: "/contact" },
    { type: "link", display: "News releases", link: "https://engage.gov.bc.ca/bcparksblog/"  },
  ]
  const utilityMenu = [
    { display: "Accessibility", link: "/accessibility" },
    { display: "Careers", link: "/careers" },
    { display: "Disclaimer", link: "/disclaimer" },
    { display: "Privacy", link: "/privacy" },
    { display: "Copyright", link: "/copyright" },
  ]

  const [searchText, setSearchText] = useState("")
  const [searchMsg, setSearchMsg] = useState("")


  const handleSearchTextChange = (str) => { // TODO - search box does nothing
    setSearchText(str);
    setSearchMsg("Search utility under construction")
  }

  return (
    <>
      <footer id="footer">
        <div className="home-footer" id="home-footer">
          <Box sx={{ margin: "40px 0" }}>
            <Grid sx={{ flexGrow: 1 }} container>
              <Grid xs={12} sm={12} md={4} lg={6} item>
                <Box>
                  <div className={classes.logoContainer} id="footer-logo">
                    <a href="/">
                      <img className={classes.logo} alt="BC Parks logo" src={bcParksWordmark} />
                    </a>
                  </div>
                </Box>
                <Box>
                  <div className={classes.searchBoxContainer}>
                    <div className={classes.searchBox + " bc-bg-blue-md"}>
                      <InputLabel htmlFor="footer-site-search">
                        Search
                      </InputLabel>
                      <TextField
                        id="footer-site-search"
                        aria-label="Search BCParks.ca"
                        placeholder="Search BCParks.ca"
                        InputLabelProps={{
                          style: { color: '#fff'}
                        }}
                        value={searchText}
                        onChange={event => {
                          handleSearchTextChange(event.target.value)
                        }} 
                        onKeyPress={ev => {
                          if (ev.key === "Enter") {
                            handleSearchTextChange(searchText)
                            ev.preventDefault()
                          }
                        }}
                        ></TextField>
                        <SearchIcon className={classes.searchIcon} />
                      </div>
                  </div>
                  { (searchMsg !== "") && (<div className={classes.searchMsg}>
                    {searchMsg}
                  </div>)}
                </Box>
              </Grid>
              <Grid xs={12} sm={12} md={8} lg={6} item>
                <Grid sx={{ flexGrow: 1 }} container>
                  <Grid className={classes.menu1} xs={6} sm={6} md={4} lg={4} item>
                    <div>
                      <FooterMenu items={menu1}></FooterMenu>
                    </div>
                  </Grid>
                  <Grid className={classes.menu2} xs={6} sm={6} md={4} lg={4} item>
                    <div>
                      <FooterMenu items={menu2}></FooterMenu>
                    </div>
                  </Grid>
                  <Grid  className={classes.menu3} xs={6} sm={6} md={4} lg={4} item>
                    <div>
                      <FooterMenu items={menu3}></FooterMenu>
                    </div>
                  </Grid>
                  <Grid className={classes.menu4} xs={6} sm={6} md={12} lg={12} item>
                    <div className={classes.socialIcons}>
                      <div className={classes.socialIcon}>
                        <a href="https://www.facebook.com/YourBCParks/">
                          <img src={facebookIcon} alt="Facebook" />
                        </a>
                      </div>
                      <div className={classes.socialIcon}>
                        <a href="https://www.instagram.com/yourbcparks">
                          <img src={instaIcon} alt="Instagram" />
                        </a>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <div className={classes.utilityMenu}>
              {utilityMenu.map((item, index) => (
                <div className={classes.utilityLink} key={index}>
                  <a href={item.link}>{item.display}</a>
                </div>
              ))}
            </div>
          </Box>
        </div>
      </footer>
    </>
  )
}
