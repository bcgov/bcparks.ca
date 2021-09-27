import React from "react"
import PropTypes from "prop-types"
import { Drawer } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const drawerWidth = 230

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: drawerWidth,
      flexShrink: 0,
    },
  },
  appBarNone: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  appBarOffset: theme.mixins.toolbar,
  drawerDesktop: {
    border: 0,
    padding: 0,
    maxWidth: drawerWidth,
    zIndex: 0,
    position: "sticky",
  },
  drawerMobile: {
    maxWidth: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  menu: {
    textDecoration: "none",
  },
}))

export default function ParkMenu(props) {
  const classes = useStyles()

  const data = props.data

  return (
    <div id="park-menu-container">
      <div className={classes.root}>
        <nav className={classes.drawer} aria-label="park info menu">
          {/* Desktop */}
          <div className="d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
            <Drawer
              classes={{
                paper: classes.drawerDesktop,
              }}
              variant="permanent"
              open
            >
              <ul>
                {data.menu.map((menu, index) => (
                  <div key={index}>
                    {menu.visible && (
                      <li
                        className={
                          data.activeSection === index ? "isCurrent" : ""
                        }
                      >
                        <a className={classes.menu} href={`#${menu.url}`}>
                          {menu.text}
                        </a>
                      </li>
                    )}
                  </div>
                ))}
              </ul>
            </Drawer>
          </div>
        </nav>
      </div>
    </div>
  )
}

ParkMenu.propTypes = {
  window: PropTypes.func,
}
