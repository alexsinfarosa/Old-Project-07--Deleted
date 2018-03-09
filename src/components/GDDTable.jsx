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

var format = require("date-fns/format");

const styles = theme => ({
  root: {
    width: "100%",
    // height: "600px",
    marginTop: theme.spacing.unit * 10,
    overflowX: "auto"
  },
  table: {
    minWidth: 800,
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
    const { classes, data, isLoading } = this.props;
    return (
      <Paper className={classes.root}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell rowSpan={2} numeric>
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
                <TableCell
                  style={{
                    borderLeft: "1px solid #E0E0E0"
                  }}
                  numeric
                >
                  Daily
                </TableCell>
                <TableCell numeric>Jan 1</TableCell>
                <TableCell numeric>Mar 1</TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #E0E0E0"
                  }}
                  numeric
                >
                  Biofix
                </TableCell>
                <TableCell numeric>Min</TableCell>
                <TableCell numeric>Avg</TableCell>
                <TableCell numeric>Max</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(-8).map(o => {
                return (
                  <TableRow key={o.date}>
                    <TableCell numeric>{format(o.date, "MMMM DD")}</TableCell>
                    <TableCell
                      style={{
                        borderLeft: "1px solid #E0E0E0"
                      }}
                      numeric
                    >
                      {o.dd}
                    </TableCell>

                    <TableCell numeric>{999}</TableCell>
                    <TableCell numeric>{888}</TableCell>
                    <TableCell numeric>{777}</TableCell>
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
