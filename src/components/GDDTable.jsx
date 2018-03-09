import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import Paper from "material-ui/Paper";
import { CircularProgress } from "material-ui/Progress";
import pink from "material-ui/colors/pink";

import format from "date-fns/format";
import isToday from "date-fns/is_today";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 2,
    overflowX: "auto"
  },
  table: {
    minWidth: 700,
    borderRadius: 4
  },
  tableHeader: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRight: "1px solid #eee"
  }
});

class GDDTable extends Component {
  render() {
    const { classes, data, isLoading, bioFix } = this.props;
    return (
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
                  rowSpan={2}
                  style={{
                    textAlign: "center",
                    margin: 0,
                    padding: 0
                  }}
                >
                  Date
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
                <TableCell style={{ textAlign: "center" }} colSpan={3}>
                  Temperature (˚F)
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell numeric>Daily</TableCell>
                <TableCell numeric>Jan 1</TableCell>
                <TableCell numeric>Mar 1</TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #E0E0E0"
                  }}
                  numeric
                >
                  <div>
                    BioFix{" "}
                    <small style={{ fontSize: "0.5rem" }}>
                      ({format(bioFix, "MMM D")}
                    </small>)
                  </div>
                </TableCell>
                <TableCell numeric>Min</TableCell>
                <TableCell numeric>Avg</TableCell>
                <TableCell numeric>Max</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(-8).map(o => {
                return (
                  <TableRow
                    hover
                    key={o.date}
                    style={{
                      background: isToday(o.date) ? pink[100] : null
                    }}
                  >
                    <TableCell
                      style={{
                        padding: "0px 10px",
                        textAlign: "center"
                      }}
                    >
                      {isToday(o.date) ? "Today" : format(o.date, "MMMM DD")}
                    </TableCell>
                    <TableCell
                      style={{
                        borderLeft: "1px solid #E0E0E0"
                      }}
                      numeric
                    >
                      {o.dd}
                    </TableCell>
                    <TableCell numeric>{o.cdd}</TableCell>
                    <TableCell numeric>{o.cddFromMarch1}</TableCell>
                    <TableCell numeric>{o.cddBioFix}</TableCell>
                    <TableCell
                      style={{
                        borderLeft: "1px solid #E0E0E0"
                      }}
                      numeric
                    >
                      {o.min}
                    </TableCell>
                    <TableCell numeric>{o.avg}</TableCell>
                    <TableCell numeric>{o.max}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(GDDTable);
