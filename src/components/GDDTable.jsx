import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import Paper from "material-ui/Paper";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  }
});

class GDDTable extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell numeric>Calories</TableCell>
              <TableCell numeric>Fat (g)</TableCell>
              <TableCell numeric>Carbs (g)</TableCell>
              <TableCell numeric>Protein (g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2].map(n => {
              return (
                <TableRow key={n}>
                  <TableCell>sdfsdf</TableCell>
                  <TableCell numeric>33</TableCell>
                  <TableCell numeric>33</TableCell>
                  <TableCell numeric>33</TableCell>
                  <TableCell numeric>33</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(GDDTable);
