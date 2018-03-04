const stationUrl = `${
  window.location.protocol
}//newa2.nrcc.cornell.edu/newaUtil/stateStationList/all`;

export const fetchStations = () => {
  return fetch(stationUrl)
    .then(res => res.json())
    .catch(error => console.log("Failed to load stations", error));
};
