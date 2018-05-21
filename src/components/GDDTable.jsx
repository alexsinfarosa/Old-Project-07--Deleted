import React, { Component, Fragment } from "react";
import { inject, observer } from "mobx-react";

// material-ui
import withRoot from "../withRoot";
import { withStyles } from "material-ui/styles";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import Paper from "material-ui/Paper";
import { CircularProgress } from "material-ui/Progress";
import Typography from "material-ui/Typography";

// date
import { format, isSameDay, getYear, differenceInDays } from "date-fns";

// styles
const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    marginTop: theme.spacing.unit * 2,
    borderRadius: 8
  },
  table: {
    // minWidth: 700,
    borderRadius: 4,
    marginBottom: theme.spacing.unit * 8
  },
  isMobile: {
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  tableCell: {
    fontSize: "0.8rem",
    padding: "0 10px",
    textAlign: "center",
    "@media (min-width: 576px)": {
      fontSize: "0.8rem"
    }
  },
  tableHeader: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRight: "1px solid #eee"
  },
  missingDays: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    marginTop: theme.spacing.unit * 1
  }
});

class GDDTable extends Component {
  timeColor = date => {
    const formattedDate = format(date, "YYYY-MM-DD");
    const formattedToday = format(new Date(), "YYYY-MM-DD");
    if (isSameDay(formattedDate, formattedToday)) return;
    if (differenceInDays(formattedDate, formattedToday) < 0) return "#0FA3B1";
    if (differenceInDays(formattedDate, formattedToday) >= 0) return "#F9E04C";
  };
  render() {
    const { classes } = this.props;
    const {
      dataForTable,
      isLoading,
      bioFix,
      dateOfInterest,
      missingDays
    } = this.props.rootStore.paramsStore;

    return (
      <Fragment>
        <Paper className={classes.root}>
          {isLoading ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell
                    className={classes.tableCell}
                    rowSpan={2}
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      margin: 0,
                      padding: 0,
                      borderRight: "1px solid #E0E0E0"
                    }}
                  >
                    <div>Date</div>
                    <div>
                      <small>({getYear(dateOfInterest)})</small>
                    </div>
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      borderLeft: "1px solid #E0E0E0",
                      borderRight: "1px solid #E0E0E0"
                    }}
                    colSpan={4}
                  >
                    <div>Degree Days (base 50 ˚F)</div>
                    <div>
                      <small>Accumulated From</small>
                    </div>
                  </TableCell>
                  <TableCell
                    className={classes.isMobile}
                    style={{ textAlign: "center" }}
                    colSpan={3}
                  >
                    Temperature (˚F)
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell} numeric>
                    Daily
                  </TableCell>
                  <TableCell className={classes.tableCell} numeric>
                    Jan 1
                  </TableCell>
                  <TableCell className={classes.tableCell} numeric>
                    Mar 1
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    style={{
                      borderRight: "1px solid #E0E0E0"
                    }}
                    numeric
                  >
                    <div>BioFix</div>
                    <div>
                      {bioFix && (
                        <small style={{ fontSize: "0.5rem" }}>
                          ({format(bioFix, "MMM D")})
                        </small>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={classes.isMobile} numeric>
                    Min
                  </TableCell>
                  <TableCell className={classes.isMobile} numeric>
                    Avg
                  </TableCell>
                  <TableCell className={classes.isMobile} numeric>
                    Max
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {dataForTable.map(o => {
                  const isToday = isSameDay(new Date(dateOfInterest), o.date);
                  const formattedDate = format(o.date, "YYYY-MM-DD");
                  const formattedToday = format(new Date(), "YYYY-MM-DD");
                  return (
                    <TableRow hover key={o.date}>
                      <TableCell
                        className={classes.tableCell}
                        style={{
                          margin: 0,
                          padding: 0,
                          width: 8,
                          background: this.timeColor(o.date)
                        }}
                      />
                      <TableCell
                        className={classes.tableCell}
                        style={{
                          // padding: "0px 10px",
                          // textAlign: "center",
                          fontSize: isToday ? "1.1rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                      >
                        {isSameDay(formattedDate, formattedToday)
                          ? "Today"
                          : format(o.date, "MMMM Do")}
                      </TableCell>
                      <TableCell
                        className={classes.tableCell}
                        style={{
                          borderLeft: "1px solid #E0E0E0",
                          fontSize: isToday ? "1.1rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                        numeric
                      >
                        {o.dd}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: isToday ? "1.1rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                        className={classes.tableCell}
                        numeric
                      >
                        {o.cdd}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: isToday ? "1.1rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                        className={classes.tableCell}
                        numeric
                      >
                        {o.cddFromMarch1}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: isToday ? "1.1rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                        className={classes.tableCell}
                        numeric
                      >
                        {o.cddBioFix}
                      </TableCell>
                      <TableCell
                        className={classes.isMobile}
                        style={{
                          borderLeft: "1px solid #E0E0E0",
                          fontSize: isToday ? "1.1rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                        numeric
                      >
                        {o.min}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: isToday ? "1.1rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                        className={classes.isMobile}
                        numeric
                      >
                        {o.avg}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: isToday ? "1.1rem" : null,
                          fontWeight: isToday ? 700 : null
                        }}
                        className={classes.isMobile}
                        numeric
                      >
                        {o.max}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Paper>
        {/* Missing Days */}
        {missingDays.length !== 0 &&
          !isLoading && (
            <Typography variant="caption" className={classes.missingDays}>
              {`(+${missingDays.length}) ${
                missingDays.length === 1 ? "day" : "days"
              } missing:
                  `}
              {missingDays.map((d, i) => {
                if (i === missingDays.length - 1) {
                  return <span key={d}>{format(d, "MMMM Do")}.</span>;
                } else {
                  return <span key={d}>{format(d, "MMMM Do")}, </span>;
                }
              })}
            </Typography>
          )}
      </Fragment>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(GDDTable)))
);
