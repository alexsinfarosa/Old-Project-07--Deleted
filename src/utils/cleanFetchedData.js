import { isSameYear } from "date-fns";
import {
  fahrenheitToCelcius,
  averageMissingValues,
  flatten,
  unflatten,
  formatTime
} from "../utils/utils";

export default (acisData, asJson) => {
  // current station
  const currentStn = acisData.get("currentStn");

  // dates has date of interest +5 days
  let dates = currentStn.map(arr => arr[0]);

  const currentStnValues = averageMissingValues(
    flatten(currentStn.map(arr => arr[1]))
  );

  // sister station
  const sisterStn = acisData.get("sisterStn");
  const sisterStnValues = flatten(sisterStn.map(arr => arr[1]));

  // replace current station values with sister station's
  let replaced = currentStnValues.map(
    (t, i) => (t === "M" ? sisterStnValues[i] : t)
  );

  replaced = averageMissingValues(replaced);

  // if date of interest is in current year
  if (isSameYear(new Date(), new Date(asJson.dateOfInterest))) {
    const forecast = acisData.get("forecast");
    const forecastValues = flatten(forecast.map(arr => arr[1]));

    // replace missing values with forecast data
    replaced = replaced.map(
      (t, i) => (t === "M" ? fahrenheitToCelcius(forecastValues[i]) : t)
    );
  }

  const replacedUnflattened = unflatten(replaced);
  let results = new Map();
  replacedUnflattened.forEach((day, i) => results.set(dates[i], day));

  // transforming data to account for Day Light Tiem Saving
  let resultsDLT = new Map();
  const tzo = acisData.get("tzo");
  const len = replacedUnflattened.length - 1;
  replacedUnflattened.forEach((arr, i) => {
    let day = arr.map((t, j) => formatTime(dates[i], j, tzo));
    if (i === len) day = day.slice(0, 23);

    let dayDLT = day.map((date, j) => {
      const [d, hr] = date.split(" ");
      return results.get(d)[hr];
    });
    resultsDLT.set(dates[i], dayDLT);
  });
  // console.log(results);
  // console.log(resultsDLT);
  return resultsDLT;
};
