import { replaceNonConsecutiveMissingValues } from "./utils";
import isThisYear from "date-fns/is_this_year";

export default (acisData, edate) => {
  const currentStn = acisData.get("currentStn");
  const sisterStn = acisData.get("sisterStn");
  let lastFiveDays;

  const results = new Map();
  let tempArr = [];
  currentStn.forEach((el, i) => {
    // replace non consecutive missing values
    tempArr = replaceNonConsecutiveMissingValues(el[1]);

    // replace missing values with sister station
    tempArr = tempArr.map((t, j) => (t === "M" ? sisterStn[i][1][j] : t));

    if (isThisYear(edate)) {
      const forecast = acisData.get("forecast");
      lastFiveDays = forecast.slice(-5);

      // replace missing values with forecast
      tempArr = tempArr.map((t, j) => (t === "M" ? forecast[i][1][j] : t));
    }

    results.set(el[0], tempArr);
  });

  if (isThisYear(edate)) {
    lastFiveDays.forEach(dayArr => {
      results.set(dayArr[0], dayArr[1].map(d => d.toString()));
    });
  }

  // console.log(results);
  return results;
};
