
import React from "react"
import { makeStyles } from "@material-ui/core/styles"

import {
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@material-ui/core"
import HTMLArea from "../HTMLArea"
import { ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  advisoryCard: {
    background: "#f2f2f2",
    color: "#000",
    paddingBottom: "10px;",
    boxShadow: "none",
    [theme.breakpoints.down('sm')]: {
      '& .MuiAccordionSummary-content': {
        display: "block",
        borderRadius: "0px 0px 4px 4px"
      },
    },
    [theme.breakpoints.up('sm')]: { // otherwise shifting margins
      borderRadius:"4px",
      '& .MuiAccordionSummary-content': {
        margin: "12px !important"
      },
    },
    '& a': {
      cursor: "pointer"
    },
    '& .MuiSvgIcon-root': {
      width: "1.5em",
      height: "1.5em"
    },
    '&::before': {
      background:"none"
    },
    '&.Mui-expanded': {
      margin:0
    },
  },
  cardTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    display: "flex",
  },
  parkLink: {
    margin: "4px 8px 4px 0",
    fontSize: "0.9rem",
    height: "30px"
  },
  dateBanner: {
    // only show for mobile
    [theme.breakpoints.up('sm')]: {
      display: "none" // don't show for mobile, see dateBanner
    },
    borderRadius: "4px 4px 0px 0px",
    padding: "3px 8px",
    color:"#fff"
  },
  dateArea: {
    [theme.breakpoints.down('sm')]: {
      display: "none" // don't show for mobile, see dateBanner
    },
    [theme.breakpoints.up('sm')]: {
      padding: ".5rem 1.75rem 0 0.5rem",
      display: "inline-flex",
    },
  },
  dateCircle: { // Not a circle for mobile (xs)
    background: '#656565', // default bg, e.g. "grey alert"
    color: '#fff',
    [theme.breakpoints.down('sm')]: {
      padding: "3px 8px",
      borderRadius: "4px"
    },
    [theme.breakpoints.up('sm')]: {
      width: '7.5rem',
      height: '7.5rem',
      paddingTop: '1.15rem',
      borderRadius: '50%',
      textAlign: 'center',      
    },
  },
  dateStr: {
    [theme.breakpoints.down('sm')]: {
      display: "block"
    },
    [theme.breakpoints.up('sm')]: {
      display: "none"
    }
  },
  dateDate: {
    [theme.breakpoints.down('sm')]: {
      display: "none"
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: "2.5rem",
      lineHeight: "3.2rem"
    }
  },
  dateMonth: {
    [theme.breakpoints.down('sm')]: {
        display: "none"
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: "1.25rem",
      lineHeight: "1.05rem"
    }
  },
  dateUnknown: {
    [theme.breakpoints.down('sm')]: {
        display: "inline-block"
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: "1.25rem",
      lineHeight: "5rem"
    }
    },
  blueAlert: {
    background: "#2464a4",
  },
  redAlert: {
    background: "#d8292f",
  },
  yellowAlert: {
    background: "#fcba19",
  },
  contentMargin: {
    width: "10rem",
    display: "inline-flex"
  },
  contentArea: {
    [theme.breakpoints.up('sm')]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  },
  detailsArea: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: "10.5rem",
    } 
  },
  noDetails: { // For cards withouth details, no expand icon and regular cursor
    '& .MuiAccordionSummary-expandIcon': {
      display:"none"
    },
    '& .MuiAccordionSummary-root.Mui-expanded': {
      margin:0
    },
    '& .MuiButtonBase-root': {
      cursor:"default !important"
    }
  },
  yearHeader: { // For the first card for each ear
    fontSize: "2rem",
    marginTop: "1rem"
  }
}));
    
const AdvisoryCard = ({ advisory, index }) => {

    const classes = useStyles();

    return (
        <>
          <Grid item xs={12}
            className={classes[advisory.detailsClass]}
            key={advisory.id} thing={advisory.isFirstInYear.toString()}>
            <div className={((advisory.isFirstInYear || (index === 0)) && (!advisory.advisoryDateObj.dateUnknown)) ? classes.yearHeader : "hidden"}>
                {advisory.advisoryDateObj.yearStr } 
            </div>
            <div className={classes.dateBanner + " " + classes[advisory.alertClass]}
            aria-label={advisory.alertMsg}>
              <div className={advisory.advisoryDateObj.dateUnknown ? "hidden" : classes.dateStr}>{advisory.advisoryDateObj.str}</div>
              <div className={advisory.advisoryDateObj.dateUnknown ? classes.dateUnknown : "hidden"}>
                Ongoing
              </div>
            </div>
            <Accordion
                className={classes.advisoryCard}>
                <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={advisory.cardTitle}
                id={advisory.id}
                >
                <div className={classes.dateArea} aria-label={advisory.alertMsg}>
                    <div className={classes.dateCircle + " " + classes[advisory.alertClass]}>
                    <div className={classes.dateDate}>{advisory.advisoryDateObj.dateStr}</div>
                    <div className={classes.dateMonth}>{advisory.advisoryDateObj.monthStr}</div>
                    <div className={advisory.advisoryDateObj.dateUnknown ? "hidden" : classes.dateStr}>{advisory.advisoryDateObj.str}</div>
                    <div className={advisory.advisoryDateObj.dateUnknown ? classes.dateUnknown : "hidden"}>
                        Ongoing
                    </div>
                    </div>
                </div>
                <div className={classes.contentArea}>
                {advisory.eventType && (
                    <div className={classes.cardTitle}>
                    {advisory.eventType.eventType}
                    </div>
                    )}
                    <div>
                    {advisory.protectedAreas.length > 0 &&
                    advisory.protectedAreas.filter(park => park.published_at).map((par, index) => (
                        <Chip
                        size="small"
                        variant="outlined"
                        component="a"
                        className={classes.parkLink}
                        href={`/${par.slug
                            ? par.slug
                            : par.protectedAreaName
                            .toLowerCase()
                            .replace(/ /g, "-")
                            }`}
                        key={index}
                        label={par.protectedAreaName}
                        />
                    ))}
                    </div>
                    <div>
                    <HTMLArea isVisible>{advisory.title}</HTMLArea>
                    </div>
                </div>
                </AccordionSummary>
                <AccordionDetails
                className={advisory.detailsClass === "details" ? undefined : "hidden"}>
                <div className={classes.detailsArea}>
                    {advisory.isEffectiveDateDisplayed &&
                    advisory.effectiveDate && (
                        <>
                        <br />
                        <p>
                            In effect {advisory.effectiveDateObj.str}
                            {advisory.isEndDateDisplayed && advisory.endDate && (
                            <>
                                {" to "}
                                {advisory.endDateObj.str}
                            </>
                            )}
                        </p>
                        </>
                    )}
                    <HTMLArea isVisible>{advisory.description}</HTMLArea>
                </div>
                </AccordionDetails>
            </Accordion>
            </Grid>
        </>
    );

}

export default AdvisoryCard