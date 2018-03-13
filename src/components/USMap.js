import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// utils
import { matchIconsToStations } from "../utils";

// material-ui
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";

const styles = theme => ({
  root: {
    width: "100%",
    height: "100%",
    marginTop: theme.spacing.unit * 4
  }
});

class USMap extends Component {
  state = {
    postalCode: "ALL",
    lat: 42.5,
    lng: -75.7,
    zoom: 6,
    name: "All States",
    bbox: [[30.22686, -104.0629], [49.38478, -69.92871]]
  };

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.on("zoomend", () => {
      console.log("Current zoom level -> ", leafletMap.getZoom());
    });
  }

  render() {
    const { classes, params, stations } = this.props;

    const stationsWithMatchedIcons = stations.map(station => {
      station["icon"] = matchIconsToStations(station, params.statePC);
      return station;
    });

    // Marker list
    const MarkerList = stationsWithMatchedIcons.map(station => (
      <Marker
        key={`${station.id} ${station.network}`}
        position={[station.lat, station.lon]}
        icon={L.icon({ iconUrl: station.icon })}
        title={station.name}
        onClick={this.onClickSetStation}
      >
        <Popup>
          <span>
            {station.name}, {station.state}
          </span>
        </Popup>
      </Marker>
    ));

    return (
      <Paper className={classes.root}>
        <Map
          style={{ width: "100%", height: "100%" }}
          bounds={this.state.bbox}
          ref={m => (this.leafletMap = m)}
          scrollWheelZoom={false}
        >
          <TileLayer url="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
          {MarkerList}
        </Map>
      </Paper>
    );
  }
}

export default withStyles(styles)(USMap);
