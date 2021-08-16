import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  AppBar,
  CssBaseline,
  Divider,
  Box,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import { Link } from "gatsby"

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
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
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

function ParkMenu(props) {
  const { window } = props
  const classes = useStyles()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    { text: "Park Overview", url: "#park-overview-container" },
    { text: "Alerts", url: "#park-advisory-details-container" },
    { text: "Camping", url: "#park-camping-details-container" },
    { text: "Facilities", url: "#park-facility-container" },
    { text: "Activities", url: "#park-activity-container" },
    { text: "Maps and Location", url: "#park-map-container" },
    { text: "Learn about this park", url: "#park-about-container" },
  ]

  const drawerItems = (
    <div>
      <div className={classes.appBarOffset} />
      <Divider />
      <Box m={2}>
        <Link to="/parks">
          <h3>Park Info</h3>
        </Link>
      </Box>
      <List>
        {menuItems.map((menu, index) => (
          <ListItem button key={menu.text}>
            <Link to={menu.url}>
              <ListItemText primary={menu.text} />
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  )

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <div id="park-menu-container">
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap></Typography>
          </Toolbar>
        </AppBar>

        <nav className={classes.drawer} aria-label="park info menu">
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawerItems}
              <h1>Mobile</h1>
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              <h1>a3</h1>
              {drawerItems}
            </Drawer>
          </Hidden>
        </nav>
      </div>
    </div>
  )
}

ParkMenu.propTypes = {
  window: PropTypes.func,
}

export default ParkMenu
