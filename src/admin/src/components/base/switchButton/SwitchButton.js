import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Switch } from "@material-ui/core";

const SwitchButton = withStyles(() => ({
  root: {
    width: 38,
    height: 22,
    padding: 0,
    margin: "1px",
  },
  switchBase: {
    padding: "2px !important",
    "&$checked": {
      transform: "translateX(16px)",
      color: "#036",
      "& + $track": {
        backgroundColor: "#036",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#036",
      border: "6px solid #036",
    },
  },
  thumb: {
    width: 18,
    height: 18,
    color: "#fff",
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid #00000033`,
    backgroundColor: "#00000033",
    opacity: 1,
    // transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export default SwitchButton;
