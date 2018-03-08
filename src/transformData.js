import { average } from "./utils";

export default cleanedData => {
  //   console.log(cleanedData);
  const dates = [...cleanedData.keys()];
  const hrTemps = [...cleanedData.values()];

  let results = [];
  hrTemps.forEach((arr, i) => {
    let p = {};
    p.date = dates[i];
    p.min = Math.min(...arr);
    p.avg = average(arr);
    p.max = Math.max(...arr);
    results.push(p);
  });

  console.log(results);
  return results;
};
