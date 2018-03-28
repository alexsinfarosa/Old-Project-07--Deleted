import { format } from "date-fns";

export default (cleanedData, asJson) => {
  const arr = [...cleanedData.entries()];
  const dates = arr.map(d => d[0]);
  const hrTemps = arr.map(d => d[1]);

  // handle accumulation from March 1st
  const datesArr = dates.map(d => d.split("-"));
  const datesNoYear = datesArr.map(d => d.slice(1).join("-"));
  const march1Idx = datesNoYear.findIndex(date => date === "03-01");

  // handle bioFix
  let bioFixIdx;
  const bioFix = asJson.bioFix ? format(asJson.bioFix, "YYYY-MM-DD") : null;
  if (bioFix) {
    const bioFixArr = bioFix.split("-");
    const bioFixNoYear = bioFixArr.slice(1).join("-");
    bioFixIdx = datesNoYear.findIndex(date => date === bioFixNoYear);
  }

  let results = [];
  const base = 50;
  let cdd = 0;
  let cddFromMarch1 = 0;
  let cddBioFix = 0;
  let missingDays = [];
  hrTemps.forEach((arr, i) => {
    const countMissinValues = arr.filter(v => v === "M");

    let min, max, avg;
    let p = {};

    if (countMissinValues.length < 5) {
      const filtered = arr.filter(v => v !== "M");
      min = Math.min(...filtered);
      max = Math.max(...filtered);
      avg = (min + max) / 2;
      // calculate dd (degree day)
      const dd = avg - base > 0 ? avg - base : 0;

      // accumulation from Jannuary 1st
      cdd += dd;

      // start accumulation from March 1st
      if (i >= march1Idx) {
        cddFromMarch1 += dd;
      }

      // start accumulation from BioFix date
      if (i >= bioFixIdx) {
        cddBioFix += dd;
      }

      p.date = dates[i];
      p.dd = dd.toFixed(0);
      p.cdd = cdd.toFixed(0);
      p.min = min.toFixed(0);
      p.avg = avg.toFixed(0);
      p.max = max.toFixed(0);
      p.cddFromMarch1 = cddFromMarch1.toFixed(0);
      p.cddBioFix = asJson.bioFix ? cddBioFix.toFixed(0) : "-";
    } else {
      missingDays.push(dates[i]);
      p.date = dates[i];
      p.dd = "N/A";
      p.cdd = "N/A";
      p.min = "N/A";
      p.avg = "N/A";
      p.max = "N/A";
      p.cddFromMarch1 = "N/A";
      p.cddBioFix = "N/A";
    }
    results.push(p);
  });

  // console.log({ results, missingDays });
  return { results, missingDays };
};
