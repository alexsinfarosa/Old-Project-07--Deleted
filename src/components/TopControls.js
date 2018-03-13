import React from "react";
import { withStyles } from "material-ui/styles";
import BottomNavigation, {
  BottomNavigationAction
} from "material-ui/BottomNavigation";
import RestoreIcon from "material-ui-icons/Restore";
import LocationOnIcon from "material-ui-icons/LocationOn";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 2
  }
});

class TopControls extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction
          label="Table"
          icon={<i className="material-icons">view_quilt</i>}
        />
        <BottomNavigationAction label="Map" icon={<LocationOnIcon />} />
      </BottomNavigation>
    );
  }
}

export default withStyles(styles)(TopControls);
