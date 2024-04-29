import React, { useState } from 'react';
import AccountInfo from '../accountInfo/AccountInfo';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from "@material-ui/icons/Close";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './responsiveDrawer.css';

const ResponsiveDrawer = ({ handleTabChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = (item) => {
    handleTabChange(null, item.value);
    setMobileOpen(false);
  };

  const items = [
    { "value": 0, "text": "Advisories" },
    { "value": 1, "text": "Park Access Status" },
    { "value": 2, "text": "Activities & Facilities" }
  ]

  const drawer = (
    <div>
      <List>
        {items.map((item, index) => (
          <ListItem
            key={index}
            button
            onClick={() => handleClick(item)}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem>
          <AccountInfo />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className="responsive-drawer-container">
      <AppBar position="static" className="appbar">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          anchor="right"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          className="responsive-drawer"
        >
          {drawer}
        </Drawer>
      </nav>
    </div>
  );
}

export default ResponsiveDrawer;
