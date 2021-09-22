import React from "react"
import PropTypes from "prop-types"
import { Drawer, Hidden } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import Scrollspy from "react-scrollspy"

const drawerWidth = 280

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
  // const { window } = props

  const classes = useStyles()
  // const theme = useTheme()
  // const [mobileOpen, setMobileOpen] = useState(false)

  const data = props.data
  const alertsCount = props.data.advisories.totalCount

  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen)
  // }

  const menuItems = [
    { text: "Park Overview", url: "park-overview-container", visible: true },
    {
      text: "Accessibility",
      url: "accessibility-details-container",
      visible: true,
    },
    {
      text: `Alerts (${alertsCount})`,
      url: "park-advisory-details-container",
      visible: true,
    },
    { text: "Camping", url: "park-camping-details-container", visible: true },
    { text: "Facilities", url: "park-facility-container", visible: true },
    { text: "Activities", url: "park-activity-container", visible: true },
    { text: "Maps and Location", url: "park-map-container", visible: true },
    {
      text: "Learn about this park",
      url: "park-about-container",
      visible: true,
    },
  ]

  const hasCamping = data.parkAccessStatus.parkFacilities.some(facility =>
    facility.facilityName.toLowerCase().includes("camping")
  )
  if (!hasCamping) menuItems[3].visible = false
  if (data.parkAccessStatus.parkFacilities.length === 0)
    menuItems[4].visible = false
  if (data.parkAccessStatus.parkActivities.length === 0)
    menuItems[5].visible = false

  const campingFacilities = data.parkAccessStatus.parkFacilities.filter(
    facility => facility.facilityName.toLowerCase().includes("camping")
  )

  let campingSubMenuItems = []
  campingFacilities.forEach(c => {
    const subMenu = {
      text: c.facilityName,
      url: "park-camping-list-container",
    }
    campingSubMenuItems.push(subMenu)
  })

  const menuFiltered = menuItems.filter(m => m.visible)
  const drawerItems = (
    <div>
      <Scrollspy
        className="scrollspy"
        items={menuFiltered.map(m => m.url)}
        currentClassName="isCurrent"
      >
        {menuFiltered.map((menu, index) => (
          <li key={index}>
            <a className={classes.menu} href={`#${menu.url}`}>
              {menu.text}
            </a>
          </li>
        ))}
      </Scrollspy>
    </div>
  )

  // const container =
  //   window !== undefined ? () => window().document.body : undefined

  return (
    <div id="park-menu-container">
      <div className={classes.root}>
        <nav className={classes.drawer} aria-label="park info menu">
          {/* Desktop */}
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerDesktop,
              }}
              variant="permanent"
              open
            >
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
