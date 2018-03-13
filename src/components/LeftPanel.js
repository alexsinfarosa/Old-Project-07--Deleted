import React, { Component, Fragment } from "react";
import { withStyles } from "material-ui/styles";
import { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Select from "material-ui/Select";
import Button from "material-ui/Button";
import { IconButton, Typography, Icon, InputAdornment } from "material-ui";
import PlaceIcon from "material-ui-icons/Place";

// picker
import { DatePicker } from "material-ui-pickers";

// data
import states from "../assets/states.json";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%"
  },
  formControl: {
    minWidth: 120,
    width: "80%",
    margin: "32px auto"
  },
  formControlIcon: {
    minWidth: 120,
    width: "80%",
    margin: "0px auto",
    marginTop: 8,
    textAlign: "center"
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  toolbar: theme.mixins.toolbar,
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid #949494"
  },
  link: {
    color: "#a52c25",
    textDecoration: "none"
  }
});

class LeftPanel extends Component {
  state = {
    statePC: "ALL",
    station: {},
    edate: new Date(),
    bioFix: null
  };

  componentDidMount() {
    console.log(this.state);
    // first reinstate localstorage
    const localStorageRef = localStorage.getItem(
      "newa-cranberry-fruitworm-model"
    );
    if (localStorageRef) {
      const params = JSON.parse(localStorageRef);

      if (Object.keys(params).length !== 0) {
        this.setState({
          statePC: params.statePC,
          station: params.station,
          edate: new Date(),
          bioFix: params.bioFix
        });

        this.props.loadData({
          statePC: params.statePC,
          station: params.station,
          edate: new Date(),
          bioFix: params.bioFix
        });
      }
    }
  }

  handleChange = event => {
    event.target.name === "station"
      ? this.setState({ [event.target.name]: JSON.parse(event.target.value) })
      : this.setState({ [event.target.name]: event.target.value });
  };

  handleEDateChange = edate => {
    console.log(edate);
    this.setState({ edate });
  };

  handleBioFixChange = bioFix => {
    this.setState({ bioFix });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.loadData({
      statePC: this.state.statePC,
      station: this.state.station,
      edate: this.state.edate,
      bioFix: this.state.bioFix
    });

    this.props.closeDrawer();
  };

  render() {
    const { classes } = this.props;

    const stateList = states.map(state => (
      <MenuItem key={state.postalCode} value={state.postalCode}>
        {state.name}
      </MenuItem>
    ));

    let filteredStationList = this.props.stations.filter(
      station => station.state === this.state.statePC
    );
    if (filteredStationList.length === 0)
      filteredStationList = this.props.stations;

    const stationList = filteredStationList.map(station => (
      <MenuItem key={station.id} value={JSON.stringify(station)}>
        {station.name}
      </MenuItem>
    ));

    return (
      <Fragment>
        <div className={`${classes.toolbar} ${classes.center}`}>
          <Typography variant="subheading">
            <a
              href="https://www.cornell.edu/"
              className={classes.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cornell University
            </a>
          </Typography>
        </div>

        <form
          className={classes.root}
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          {/* state */}

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="statePC">
              State<IconButton
                onClick={this.props.toggleModal}
                aria-label="map"
                color="primary"
                style={{
                  margin: 0,
                  padding: 0,
                  fontSize: 30,
                  marginBottom: 10
                }}
              >
                <PlaceIcon />
              </IconButton>
            </InputLabel>
            <br />
            <Select
              style={{ marginTop: 10 }}
              autoWidth={true}
              value={this.state.statePC}
              onChange={this.handleChange}
              inputProps={{
                name: "statePC",
                id: "statePC"
              }}
            >
              {stateList}
            </Select>
          </FormControl>

          {/* station */}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="station">
              Station ({this.state.statePC === "ALL"
                ? this.props.stations.length
                : stationList.length})
            </InputLabel>
            <Select
              autoWidth={true}
              value={JSON.stringify(this.state.station)}
              onChange={this.handleChange}
              inputProps={{
                name: "station",
                id: "station"
              }}
            >
              {stationList}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <DatePicker
              label="Date of Interest"
              maxDateMessage="Date must be less than today"
              value={this.state.edate}
              onChange={this.handleEDateChange}
              format="MMMM Do YYYY"
              disableFuture={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Icon>date_range</Icon>
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <DatePicker
              label="BioFix Date"
              // helperText="Possible manual entry via keyboard"
              maxDateMessage="Date must be less than date of interest"
              value={this.state.bioFix}
              onChange={this.handleBioFixChange}
              format="MMMM Do YYYY"
              disableFuture={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Icon>date_range</Icon>
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </FormControl>

          <Button
            variant="raised"
            color="primary"
            className={classes.formControl}
            type="submit"
            disabled={
              Object.keys(this.state.station).length === 0 ? true : false
            }
          >
            Calculate
          </Button>
        </form>
      </Fragment>
    );
  }
}

export default withStyles(styles)(LeftPanel);
