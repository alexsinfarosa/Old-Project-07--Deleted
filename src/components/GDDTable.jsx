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
                <TableCell>Date</TableCell>
                <TableCell colSpan={4}>Degree Days (base 50 ˚F)</TableCell>
                <TableCell colSpan={3}>Temperature (˚F)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell colSpan={3}>Accumulated From</TableCell>
                <TableCell colSpan={3} />
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell numeric>Daily</TableCell>
                <TableCell numeric>Jan 1</TableCell>
                <TableCell numeric>Mar 1</TableCell>
                <TableCell numeric>Biofix</TableCell>
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
                    <TableCell numeric>{o.dd}</TableCell>
                    <TableCell numeric>{o.cdd}</TableCell>
                    <TableCell numeric>{999}</TableCell>
                    <TableCell numeric>{888}</TableCell>
                    <TableCell numeric>{777}</TableCell>
                    <TableCell numeric>{o.min}</TableCell>
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
