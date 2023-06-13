import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

export default withStyles(() => ({
    tooltip: {
        backgroundColor: "#fff",
        color: "rgba(0, 0, 0, 0.87)",
        boxShadow: "rgba(0, 0, 0, 0.35) 1px 1px 15px",
        fontSize: 12,
    },
}))(Tooltip);  
