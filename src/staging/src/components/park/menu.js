import React from "react"
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"

export default function ButtonAppBar() {
  return (
    <div>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Box mr={2}>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography variant="h6">News</Typography>
          <Box flexGrow={1} />
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      Text to be shown.
    </div>
  )
}
