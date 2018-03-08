// import moment from "moment";

// Handling Temperature parameter and Michigan network id adjustment
export const networkTemperatureAdjustment = network => {
  // Handling different temperature parameter for each network
  if (network === "newa" || network === "icao" || network === "njwx") {
    return "23";
  } else if (
    network === "miwx" ||
    (network === "cu_log" || network === "culog")
  ) {
    return "126";
  }
};

// Handling Michigan state ID adjustment
export const michiganIdAdjustment = station => {
  if (
    station.state === "MI" &&
    station.network === "miwx" &&
    station.id.slice(0, 3) === "ew_"
  ) {
    // example: ew_ITH
    return station.id.slice(3, 6);
  }
  return station.id;
};

// Returns the average of two numbers.
export const avgTwoStringNumbers = (a, b) => {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  return Math.round((aNum + bNum) / 2).toString();
};

export const replaceNonConsecutiveMissingValues = arr => {
  return arr.map((t, i) => {
    if (i === 0 && t === "M") {
      return arr[i + 1];
    } else if (i === arr.length - 1 && t === "M") {
      return arr[i - 1];
    } else if (t === "M" && arr[i - 1] !== "M" && arr[i + 1] !== "M") {
      return avgTwoStringNumbers(arr[i - 1], arr[i + 1]);
    } else {
      return t;
    }
  });
};

// Returns average of all the values in array
export const average = data => {
  // handling the case for T and W
  if (data.length === 0) return 0;

  //  calculating average
  let results = data.map(e => parseFloat(e));
  return Math.round(results.reduce((acc, val) => acc + val, 0) / data.length);
};

// convert time in local standard time to local time (based on time zone and dst)
// function formatTime(day, hour, tzo) {
//   var time_zone_name = {
//     5: "America/New_York",
//     6: "America/Chicago",
//     7: "America/Denver",
//     8: "America/Los_Angeles"
//   };
//   return moment
//     .utc(day)
//     .hour(hour)
//     .add(Math.abs(tzo), "hours")
//     .tz(time_zone_name[Math.abs(tzo)])
//     .format("MM/DD/YYYY HH:00 z");
// }

// convert from ACIS results object to new object keyed on date/time (i.e. one record per hour)
// function serializeObject(results, input_params) {
//   var hlydate,
//     dt_key,
//     hrly_data = {},
//     data = results.data,
//     tzo = -results.meta.tzo,
//     elems =
//       typeof input_params === "string"
//         ? [input_params]
//         : input_params.elems.map(function(elem) {
//             return elem.vX;
//           });
//   if (data && data.length > 0) {
//     data.forEach(function(dlyrec) {
//       hlydate = dlyrec[0];
//       for (var h = 1; h <= 24; h += 1) {
//         dt_key = [hlydate, h].join("-");
//         hrly_data[dt_key] = {};
//         hrly_data[dt_key].date = formatTime(hlydate, h, tzo);
//         dlyrec.slice(1).forEach(function(elval, ie) {
//           hrly_data[dt_key][elems[ie]] = elval[h - 1];
//         });
//       }
//     });
//   }
//   return hrly_data;
// }
