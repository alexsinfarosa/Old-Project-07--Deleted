import React, { Component, Fragment } from "react";
import { withStyles } from "material-ui/styles";
import { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Select from "material-ui/Select";
import Typography from "material-ui/Typography";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";

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
    disease: "",
    stateUS: "ALL",
    station: "",
    dateOfInterest: "",
    blossomDate: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.addQuery({
      disease: this.state.disease,
      stateUS: this.state.stateUS,
      station: this.state.station,
      dateOfInterest: this.state.dateOfInterest,
      blossomDate: this.state.blossomDate
    });

    // clear fields
    this.setState({
      disease: "",
      stateUS: "ALL",
      station: "",
      dateOfInterest: "",
      blossomDate: ""
    });
  };

  render() {
    const { classes } = this.props;

    const stateList = states.map(state => (
      <MenuItem key={state.postalCode} value={state.postalCode}>
        {state.name}
      </MenuItem>
    ));

    let filteredStationList = this.props.stations.filter(
      station => station.state === this.state.stateUS
    );
    if (filteredStationList.length === 0)
      filteredStationList = this.props.stations;

    const stationList = filteredStationList.map(station => (
      <MenuItem key={station.id} value={station.id}>
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
          {/* Disease */}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="disease">Disease</InputLabel>
            <Select
              autoWidth={true}
              value={this.state.disease}
              onChange={this.handleChange}
              inputProps={{
                name: "disease",
                id: "disease"
              }}
            >
              <MenuItem value={"ciccio"}>ciccio...</MenuItem>
            </Select>
          </FormControl>

          {/* state */}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="stateUS">State</InputLabel>
            <Select
              autoWidth={true}
              value={this.state.stateUS}
              onChange={this.handleChange}
              inputProps={{
                name: "stateUS",
                id: "stateUS"
              }}
            >
              {stateList}
            </Select>
          </FormControl>

          {/* station */}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="station">
              Station ({this.state.stateUS === "ALL"
                ? this.props.stations.length
                : stationList.length})
            </InputLabel>
            <Select
              autoWidth={true}
              value={this.state.station}
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
            <Typography variant="body2">Model Starts on March 1st</Typography>
          </FormControl>

          <FormControl className={classes.formControl}>
            <TextField
              required
              id="dateOfInterest"
              name="dateOfInterest"
              label="Date of Interest"
              type="date"
              value={this.state.dateOfInterest}
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
              id="blossomDate"
              name="blossomDate"
              label="Blossom Date"
              type="date"
              value={this.state.blossomDate}
              // defaultValue="2017-05-24"
              className={classes.textField}
              onChange={this.handleChange}
              InputLabelProps={{
                shrink: true
              }}
              disabled={true}
            />
          </FormControl>

          <Button
            variant="raised"
            color="primary"
            className={classes.formControl}
            type="submit"
            disabled={
              this.state.disease === "" ||
              this.state.stateUS === "ALL" ||
              this.state.station === "" ||
              this.state.dateOfInterest === ""
                ? true
                : false
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
