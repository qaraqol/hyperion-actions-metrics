# Hyperion Actions Metrics

This project provides tools to track and compare the daily number of actions processed by Hyperion nodes on the WAX blockchain.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Configuration](#configuration)
- [File Description](#file-description)

## Features

- Track daily action counts for specified Hyperion nodes
- Compare action counts between two nodes
- Generate detailed JSON reports of comparisons
- Configurable endpoints for easy addition of new nodes
- Customizable date range for data collection

## Prerequisites

- [Bun](https://bun.sh/) runtime environment

## Usage

1. Configure the endpoints and date range in `config.js` (see [Configuration](#configuration) section).

2. Run the action tracking script:

   ```bash
   bun run trackActions.js
   ```

   This will generate a JSON file with the name of the first endpoint in your configuration.

3. To track actions for other endpoints, modify the `trackActions.js` script to use different indices from the `endPoints` array.

4. After generating data for at least two endpoints, run the comparison script:
   ```bash
   bun run compareActions.js
   ```
   This will generate a `comparisonResults.json` file with detailed comparisons.

## Configuration

Edit the `config.js` file to add or modify Hyperion endpoints and set the date range:

```javascript
export default endPoints = [
  { name: "Qaraqol", url: "https://wax.qaraqol.com" },
  { name: "HyperionEndpointName", url: "https://hyperion-url.com" },
  { name: "Local", url: "127.0.0.1:7000" },
  // Add more endpoints here as needed for future
];

export const dateToStart = new Date(Date.UTC(2024, 9, 12, 0, 0, 0)); // Current Date month starts from 0, the example shows 12th October 2024, 12 AM.
export const daysToCheck = 42; // Going in Reverse
```

Note:

- The first endpoint in this array will be tracked by default in `trackActions.js`.
- `dateToStart` sets the starting date for data collection (note that months are zero-indexed).
- `daysToCheck` determines how many days of data will be collected, counting backwards from the start date.

## File Description

- `trackActions.js`: Fetches daily action counts for the first specified endpoint in `config.js`.
- `compareActions.js`: Compares action counts between two endpoints.
- `config.js`: Contains configuration for Hyperion endpoints and data collection parameters.
- `package.json`: Defines project metadata and dependencies.
