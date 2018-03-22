import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import withRoot from "../withRoot";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    marginTop: theme.spacing.unit * 1,
    "@media (min-width: 576px)": {
      marginTop: theme.spacing.unit * 4
    }
  },
  header: {
    fontSize: "1rem",
    color: "black",
    "@media (min-width: 576px)": {
      fontSize: "1.5rem"
    }
  }
});

class Header extends Component {
  render() {
    const { classes } = this.props;
    const { station } = this.props.rootStore.paramsStore;

    return (
      <div className={classes.root}>
        <Typography variant="display1" className={classes.header}>
          Results for {station.name}, {station.state}
        </Typography>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(Header)))
);
