import React, { Component, Fragment } from "react";
import { withStyles } from "material-ui/styles";
import { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Select from "material-ui/Select";
import Typography from "material-ui/Typography";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";

import moment from "moment";
import format from "date-fns/format";

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
    disease: "xxx",
    statePC: "ALL",
    station: {},
    sdate: "2018-01-01",
    edate: format(new Date(), "YYYY-MM-DD"),
    bioFix: ""
  };

  componentDidMount() {
    // first reinstate localstorage
    const localStorageRef = localStorage.getItem(
      "newa-cranberry-fruitworm-model"
    );
    if (localStorageRef) {
      const params = JSON.parse(localStorageRef);

      if (Object.keys(params).length !== 0) {
        this.setState({
          disease: params.disease,
          statePC: params.statePC,
          station: params.station,
          sdate: params.sdate,
          edate: params.edate,
          bioFix: params.bioFix
        });

        this.props.loadData({
          disease: params.disease,
          statePC: params.statePC,
          station: params.station,
          sdate: params.sdate,
          edate: params.edate,
          bioFix: params.bioFix
        });
      }
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === "station") {
      this.setState({ [event.target.name]: JSON.parse(event.target.value) });
    }
    if (event.target.name === "edate") {
      const sdate = `${moment(event.target.value).year()}-01-01`;
      const edate = event.target.value;
      this.setState({ sdate, edate });
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.loadData({
      disease: this.state.disease,
      statePC: this.state.statePC,
      station: this.state.station,
      sdate: this.state.sdate,
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
            <InputLabel htmlFor="statePC">State</InputLabel>
            <Select
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
            <TextField
              required
              id="edate"
              name="edate"
              label="Date of Interest"
              type="date"
              value={this.state.edate}
              onChange={this.handleChange}
              // defaultValue="2017-05-24"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <TextField
              id="bioFix"
              name="bioFix"
              label="BioFix Date"
              type="date"
              value={this.state.bioFix}
              onChange={this.handleChange}
              // defaultValue="2017-05-24"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>

          <Button
            variant="raised"
            color="primary"
            className={classes.formControl}
            type="submit"
            // disabled={
            //   this.state.statePC === "ALL" ||
            //   Object.keys(this.state.station).length === 0 ||
            //   this.state.edate === ""
            //     ? true
            //     : false
            // }
          >
            Calculate
          </Button>
        </form>
      </Fragment>
    );
  }
}

export default withStyles(styles)(LeftPanel);
