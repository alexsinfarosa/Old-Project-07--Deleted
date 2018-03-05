import fetchACISData from "utils/fetchACISData";
import { replaceNonConsecutiveMissingValues } from "utils/utils";
import isThisYear from "date-fns/is_this_year";

// Replace missing values
export const loadACISData = (station, seasonStartDate, selectedDate) => {
  return fetchACISData(station, seasonStartDate, selectedDate).then(res => {
    const cStation = res.get("cStation");
    const sStation = res.get("sStation");
    const forecast = res.get("forecast");

    const cStationClean = new Map();
    for (const [date, tempsArr] of cStation) {
      // replace non consecutive missing values
      const cStationTemps = replaceNonConsecutiveMissingValues(tempsArr);

      // replace missing values with sister station
      let cStationTempsReplaced = cStationTemps.map(
        (t, i) => (t === "M" ? sStation.get(date)[i] : t)
      );

      if (isThisYear(selectedDate)) {
        // console.log("FORECAST DATA");
        // if year of selectedDate is current year, replace missing values with forecast
        cStationTempsReplaced = cStationTemps.map(
          (t, i) => (t === "M" ? forecast.get(date)[i] : t)
        );
      }

      cStationClean.set(date, cStationTempsReplaced);

      // If current year, add 5 days forecast data to current station
      if (isThisYear(selectedDate)) {
        const dates = [...forecast.keys()];
        dates.slice(1).forEach(date => {
          cStationClean.set(date, forecast.get(date));
        });
      }
    }

    res.set("cStationClean", cStationClean);

    // console.log(res);
    return res;
  });
};
