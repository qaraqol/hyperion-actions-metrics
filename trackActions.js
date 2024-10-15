import { endPoints, daysToCheck, dateToStart } from "./config";

const endPoint = endPoints[0];
const dateAfter = dateToStart;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const result = [];
(async () => {
  console.log(
    "Tracking daily action data for " +
      endPoint.name +
      " for the past " +
      daysToCheck +
      " days. URL: " +
      endPoint.url
  );
  for (let i = 0; i < daysToCheck; i++) {
    const dateBefore = new Date(dateAfter);
    dateBefore.setUTCDate(dateBefore.getUTCDate() + 1);
    const URL = `${
      endPoint.url
    }/v2/history/get_actions?after=${dateAfter.toISOString()}&before=${dateBefore.toISOString()}&track=true&limit=1&sort=1`;
    try {
      const response = await fetch(URL);
      const data = await response?.json();
      result.push({
        date: `${dateAfter.toISOString()}`,
        actionsTotal: data.total.value,
        block_num: data.actions[0]?.block_num,
      });
      console.log("Fetched for: ", dateAfter);
      dateAfter.setUTCDate(dateAfter.getUTCDate() - 1);
      await sleep(1000); //1 second delay between requests
    } catch (e) {
      console.log("Fetch Error: ", e);
    }
  }
  try {
    console.log(`Writing to ${endPoint.name}.json`);
    await Bun.write(`${endPoint.name}.json`, JSON.stringify(result, null, 2));
    console.log("Write to file successful.");
  } catch (e) {
    console.log("Write to file error: ", e);
  }
})();
