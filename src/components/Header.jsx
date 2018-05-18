import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import withRoot from "../withRoot";

const styles = theme => ({
  root: {
    width: "100%",
    flex: "none",
    display: "flex",
    maxWidth: 1200,
    margin: "0 auto",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 1
  },
  header: {
    fontSize: "1.2rem",
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
        <Typography variant="display1" gutterBottom>
          Results for {station.name}, {station.state}
        </Typography>
      </div>
    );
  }
}

export default withRoot(
  withStyles(styles)(inject("rootStore")(observer(Header)))
);
