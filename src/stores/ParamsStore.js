import { decorate, observable, computed, action, reaction, when } from "mobx";
import states from "../assets/states.json";
import axios from "axios";

// utils
import { idAdjustment, vXDef } from "../utils/utils";

// date-fns
import {
  format,
  startOfYear,
  addDays,
  isWithinInterval,
  getYear,
  isAfter,
  isSameDay
} from "date-fns";

// fetch
import fetchData from "../utils/fetchData";
import cleanFetchedData from "../utils/cleanFetchedData";
import currentModel from "../utils/currentModel";

// const
const url = `${
  window.location.protocol
}//newa2.nrcc.cornell.edu/newaUtil/stateStationList/all`;

export default class ParamsStore {
  constructor() {
    when(() => this.stations.length === 0, () => this.loadStations());

    when(
      () => !this.isLoading,
      () => {
        this.readFromLocalstorage();
        reaction(() => this.asJson, json => this.writeToLocalstorage(json));
      }
    );

    reaction(
      () => this.asJson,
      () =>
        this.stationID === "" || !this.dateOfInterest
          ? null
          : this.setData(this.params)
    );
  }

  isLoading = false;

  //   state
  postalCode = "ALL";
  setPostalCode = e => {
    this.postalCode = e.target.value;
    this.stationID = "";
  };
  get state() {
    return states.find(state => state.postalCode === this.postalCode);
  }
  get states() {
    return states;
  }

  //   station
  stationID = "";
  setStationID = e => {
    this.stationID = e.target.value;
    const station = this.stations.find(
      station => station.id === e.target.value
    );
    this.postalCode = station.state;
  };
  get station() {
    return this.stations.find(station => station.id === this.stationID);
  }
  stations = [];
  setStations = d => (this.stations = d);

  loadStations() {
    this.isLoading = true;
    return axios
      .get(url)
      .then(res => {
        // console.log(res.data.stations);
        this.setStations(res.data.stations);
        this.isLoading = false;
      })
      .catch(err => {
        console.log("Failed to load stations", err);
      });
  }

  get filteredStationList() {
    if (this.postalCode === "ALL") {
      return this.stations;
    } else {
      return this.stations.filter(station => station.state === this.postalCode);
    }
  }

  //   date of interest
  dateOfInterest = new Date();
  setDateOfInterest = d => {
    this.dateOfInterest = d;
    const yearDateOfInterest = getYear(d);
    const yearBioFix = getYear(this.bioFix);
    return yearBioFix === yearDateOfInterest ? null : (this.bioFix = null);
  };

  //   bioFix
  bioFix = null;
  setBioFix = d => {
    if (d !== null) {
      const year = getYear(this.dateOfInterest);
      const start = new Date(`${year}-01-01 00:00`);
      const end = new Date();

      isWithinInterval(new Date(d), { start, end })
        ? (this.bioFix = new Date(d))
        : (this.bioFix = null);
    } else {
      this.bioFix = null;
    }
  };

  //   localstorage
  writeToLocalstorage = json => {
    localStorage.setItem(
      "newa-cranberry-fruitworm-model",
      JSON.stringify(json)
    );
  };

  readFromLocalstorage = () => {
    const localStorageRef = localStorage.getItem(
      "newa-cranberry-fruitworm-model"
    );
    if (localStorageRef) {
      const params = JSON.parse(localStorageRef);
      if (Object.keys(params).length !== 0) {
        this.postalCode = params.postalCode;
        this.stationID = params.stationID;
        this.dateOfInterest = params.dateOfInterest;
        this.bioFix = params.bioFix;
      }
    }
  };

  get asJson() {
    return {
      postalCode: this.postalCode,
      stationID: this.stationID,
      dateOfInterest: this.dateOfInterest,
      bioFix: this.bioFix
    };
  }

  // get asJson2() {
  //   return {
  //     [this.stationID]: {
  //       [getYear(this.dateOfInterest)]: {
  //         stationID: this.stationID,
  //         postalCode: this.postalCode,
  //         dateOfInterest: this.dateOfInterest,
  //         bioFix: { year: this.bioFix }
  //       }
  //     }
  //   };
  // }

  get params() {
    if (this.station) {
      let edate = this.dateOfInterest;
      if (isAfter(new Date(this.bioFix), new Date(this.dateOfInterest))) {
        edate = this.bioFix;
      }
      return {
        sid: `${idAdjustment(this.station)} ${this.station.network}`,
        sdate: format(startOfYear(this.dateOfInterest), "YYYY-MM-DD"),
        edate: format(addDays(edate, 5), "YYYY-MM-DD"),
        elems: [vXDef[this.station.network]["temp"]],
        meta: "tzo"
      };
    }
  }

  setStateStationFromMap = station => {
    this.postalCode = station.state;
    this.stationID = station.id;
  };

  data = [];
  missingDays = [];
  setData = async params => {
    this.isLoading = true;

    // fetching data
    const acisData = await fetchData(params).then(res => res);

    // clean and replacements
    const cleanedData = await cleanFetchedData(acisData, this.asJson);

    // transform data based on current model
    const { results, missingDays } = await currentModel(
      cleanedData,
      this.asJson
    );

    this.data = results;
    this.missingDays = missingDays;
    this.isLoading = false;
  };

  get dataForTable() {
    const todayIdx = this.data.findIndex(obj =>
      isSameDay(new Date(obj.date), new Date(this.dateOfInterest))
    );
    return this.data.slice(todayIdx - 3, todayIdx + 6);
  }
}

decorate(ParamsStore, {
  isLoading: observable,
  postalCode: observable,
  setPostalCode: action,
  state: computed,
  stationID: observable,
  setStationID: action,
  station: computed,
  stations: observable,
  setStations: action,
  filteredStationList: computed,
  dateOfInterest: observable,
  setDateOfInterest: action,
  bioFix: observable,
  setBioFix: action,
  asJson: computed,
  readFromLocalstorage: action,
  params: computed,
  setStateStationFromMap: action,
  data: observable,
  missingDays: observable,
  setData: action,
  dataForTable: computed
});
