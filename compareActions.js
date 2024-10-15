import { endPoints } from "./config";
const endPointOne = endPoints[0];
const endPointTwo = endPoints[1];

const dataOne = JSON.parse(await Bun.file(`${endPointOne.name}.json`).text());
const dataTwo = JSON.parse(await Bun.file(`${endPointTwo.name}.json`).text());

const results = [];
let totalActionsOne = 0;
let totalActionsTwo = 0;

const compareData = (dataOne, dataTwo) => {
  dataOne.forEach((entryOne) => {
    const matchingEntry = dataTwo.find(
      (entryTwo) => entryTwo.date === entryOne.date
    );

    totalActionsOne += entryOne.actionsTotal;

    if (matchingEntry) {
      const actionsOne = entryOne.actionsTotal;
      const actionsTwo = matchingEntry.actionsTotal;

      if (actionsOne === actionsTwo) {
        results.push({
          date: entryOne.date,
          message: `${endPointOne.name} and ${endPointTwo.name} have the same number of actions`,
          actionsTotal: actionsOne,
          blockNum: {
            [endPointOne.name]: entryOne.block_num,
            [endPointTwo.name]: matchingEntry.block_num,
          },
        });
      } else {
        const difference = Math.abs(actionsOne - actionsTwo);
        const percentageDifference = (
          (difference / Math.max(actionsOne, actionsTwo)) *
          100
        ).toFixed(2);
        const higherEndpoint =
          actionsOne > actionsTwo ? endPointOne.name : endPointTwo.name;
        const lowerEndpoint =
          actionsOne > actionsTwo ? endPointTwo.name : endPointOne.name;

        results.push({
          date: entryOne.date,
          message: `${higherEndpoint} processed ${difference} more actions (${percentageDifference}% higher) than ${lowerEndpoint}`,
          [endPointOne.name]: actionsOne,
          [endPointTwo.name]: actionsTwo,
          difference,
          percentageDifference: `${percentageDifference}%`,
          blockNum: {
            [endPointOne.name]: entryOne.block_num,
            [endPointTwo.name]: matchingEntry.block_num,
          },
        });
      }
    } else {
      results.push({
        date: entryOne.date,
        message: `No matching entry found on this date for ${endPointTwo.name}`,
        [endPointOne.name]: entryOne.actionsTotal,
        blockNum: {
          [endPointOne.name]: entryOne.block_num,
        },
      });
    }
  });

  dataTwo.forEach((entryTwo) => {
    const matchingEntry = dataOne.find(
      (entryOne) => entryOne.date === entryTwo.date
    );
    totalActionsTwo += entryTwo.actionsTotal;
    if (!matchingEntry) {
      results.push({
        date: entryTwo.date,
        message: `No matching entry found on this date for ${endPointOne.name}`,
        [endPointTwo.name]: entryTwo.actionsTotal,
        blockNum: {
          [endPointTwo.name]: entryTwo.block_num,
        },
      });
    }
  });
};

compareData(dataOne, dataTwo);

// Calculate overall total actions difference
const totalDifference = totalActionsOne - totalActionsTwo;

let overallResult;
if (totalDifference !== 0) {
  const percentageDifference = (
    (Math.abs(totalDifference) / Math.max(totalActionsOne, totalActionsTwo)) *
    100
  ).toFixed(2);
  const higherEndpoint =
    totalDifference > 0 ? endPointOne.name : endPointTwo.name;
  const lowerEndpoint =
    totalDifference > 0 ? endPointTwo.name : endPointOne.name;
  overallResult = {
    message: `Overall comparison: ${higherEndpoint} processed ${Math.abs(
      totalDifference
    )} more actions (${percentageDifference}% higher) than ${lowerEndpoint} over the analyzed period.`,
    [endPointOne.name]: totalActionsOne,
    [endPointTwo.name]: totalActionsTwo,
    difference: Math.abs(totalDifference),
    percentageDifference: `${percentageDifference}%`,
  };
} else {
  overallResult = {
    message: `Overall comparison: ${endPointOne.name} and ${endPointTwo.name} processed the same total number of actions over the analyzed period.`,
    [endPointOne.name]: totalActionsOne,
    [endPointTwo.name]: totalActionsTwo,
  };
}

// Add the overall result to the beginning of the array
results.unshift(overallResult);

// Write results to a JSON file
await Bun.write("comparisonResults.json", JSON.stringify(results, null, 2));
