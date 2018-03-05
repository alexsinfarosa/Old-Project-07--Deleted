import { replaceNonConsecutiveMissingValues } from "./utils";
import isThisYear from "date-fns/is_this_year";

export default (acisData, edate) => {
  const currentStn = acisData.get("currentStn");
  const sisterStn = acisData.get("sisterStn");
  const forecast = acisData.get("forecast");

  const results = new Map();
  let tempArr = [];
  currentStn.forEach((el, i) => {
    // replace non consecutive missing values
    tempArr = replaceNonConsecutiveMissingValues(el[1]);

    // replace missing values with sister station
    tempArr = tempArr.map((t, i) => (t === "M" ? sisterStn[i][1] : t));

    if (isThisYear(edate)) {
      // replace missing values with forecast
      tempArr = tempArr.map((t, i) => (t === "M" ? forecast[i][1] : t));
    }

    results.set(el[0], tempArr);
  });

  if (isThisYear(edate)) {
    const lastFiveDays = forecast.slice(-5);
    lastFiveDays.forEach(el => {
      results.set(el[0], el[1]);
    });
  }

  return results;
};
