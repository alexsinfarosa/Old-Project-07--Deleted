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

const styles = theme => ({
  root: {
    width: "100%",
    // height: "600px",
    marginTop: theme.spacing.unit * 10,
    overflowX: "auto"
  },
  table: {
    minWidth: 800
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
                <TableCell numeric>Date</TableCell>
                <TableCell numeric>Min</TableCell>
                <TableCell numeric>Avg</TableCell>
                <TableCell numeric>Max</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(-8).map(o => {
                return (
                  <TableRow key={o.date}>
                    <TableCell numeric>{o.date}</TableCell>
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
