import React, { Component } from "react";
import { Map, TileLayer } from "react-leaflet";

// material-ui
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";

const styles = theme => ({
  root: {
    width: "100%",
    height: "35vh",
    marginTop: theme.spacing.unit * 4
  }
});

class USMap extends Component {
  state = {
    lat: 42.9543,
    lng: -75.5262,
    zoom: 6
  };

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.on("zoomend", () => {
      console.log("Current zoom level -> ", leafletMap.getZoom());
    });
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Map
          style={{ width: "100%", height: "100%" }}
          center={position}
          zoom={this.state.zoom}
          ref={m => (this.leafletMap = m)}
          scrollWheelZoom={false}
        >
          <TileLayer url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
        </Map>
      </Paper>
    );
  }
}

export default withStyles(styles)(USMap);
