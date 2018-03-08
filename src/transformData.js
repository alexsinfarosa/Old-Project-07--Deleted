import { average } from "./utils";

export default cleanedData => {
  //   console.log(cleanedData);
  const dates = [...cleanedData.keys()];
  const hrTemps = [...cleanedData.values()];

  let results = [];
  const base = 50;
  let cdd = 0;
  hrTemps.forEach((arr, i) => {
    let p = {};

    const avg = average(arr);

    // calculate dd (degree day)
    const dd = avg - base > 0 ? avg - base : 0;
    cdd += dd;

    p.date = dates[i];
    p.dd = dd;
    p.cdd = cdd;
    p.min = Math.min(...arr);
    p.avg = avg;
    p.max = Math.max(...arr);
    results.push(p);
  });

  console.log(results);
  return results;
};
