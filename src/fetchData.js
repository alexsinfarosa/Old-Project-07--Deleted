import axios from "axios";
import moment from "moment";
const protocol = window.location.protocol;
const dateFormat = "YYYY-MM-DD";

// Fetch all stations -------------------------------------------------------------------
const stationsUrl = `${protocol}//newa2.nrcc.cornell.edu/newaUtil/stateStationList/all`;
export const fetchAllStations = () => {
  return axios
    .get(stationsUrl)
    .then(res => res.data.stations)
    .catch(err => console.log("Failed to load all stations", err));
};

// // Fetch selected station hourly data ---------------------------------------------------
const url = `${protocol}//data.nrcc.rcc-acis.org/StnData`;
export const fetchCurrentStationHourlyData = params => {
  return axios
    .post(url, params)
    .then(res => res.data)
    .catch(err => console.log("Failed to load station data ", err));
};

// Fetch sister station Id and network -----------------------------------------------------
const sisterIdNetworkUrl = `${protocol}//newa2.nrcc.cornell.edu/newaUtil/stationSisterInfo`;
const fetchSisterStationIdAndNetwork = params => {
  const [id, network] = params.sid.split(" ");

  return axios(`${sisterIdNetworkUrl}/${id}/${network}`)
    .then(res => res.data.temp)
    .catch(err =>
      console.log("Failed to load sister station's id and network", err)
    );
};

// Fetch sister station hourly data --------------------------------------------------------
const sisterUrl = `${protocol}//data.nrcc.rcc-acis.org/StnData`;
export const fetchSisterStationHourlyData = params => {
  return axios
    .post(sisterUrl, params)
    .then(res => res.data)
    .catch(err => console.log("Failed to load station data ", err));
};

// Fetch forecast hourly data --------------------------------------------------------------
const forecastUrl = `${protocol}//newa2.nrcc.cornell.edu/newaUtil/getFcstData`;
const fetchHourlyForcestData = params => {
  // always need to add 5 days
  const plusFiveDays = moment()
    .add(5, "days")
    .format(dateFormat);
  const [id, network] = params.sid.split(" ");

  return axios
    .get(`${forecastUrl}/${id}/${network}/temp/${params.sdate}/${plusFiveDays}`)
    .then(res => res.data)
    .catch(err => console.log("Failed to load hourly forecast data", err));
};

// Main Function
export default async params => {
  const results = new Map();

  // get current station hourly data
  const currentStation = await fetchCurrentStationHourlyData(params);
  results.set("currentStn", currentStation);

  // get sister station id and network
  const sisterStationIdAndNetwork = await fetchSisterStationIdAndNetwork(
    params
  );

  // get sister station hourly data
  let sisParams = { ...params };
  sisParams.sid = sisterStationIdAndNetwork;
  const sisterStation = await fetchSisterStationHourlyData(sisParams);
  results.set("sisterStn", sisterStation);

  // get forecast hourly data
  const forecastData = await fetchHourlyForcestData(params);
  results.set("forecast", forecastData);

  // console.log(results);
  return results;
};
