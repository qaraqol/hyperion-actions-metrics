//The first endpoint in this array will be tracked by the trackActions.js so please modify accordingly
export const endPoints = [
  { name: "EOSphere", url: "https://wax.eosphere.io" },
  { name: "Qaraqol", url: "https://wax.qaraqol.com" },
  { name: "Local", url: "127.0.0.1:7000" },
  // Add more endpoints here as needed for future
];

export const dateToStart = new Date(Date.UTC(2024, 9, 12, 0, 0, 0)); //Current Date month starts from 0
export const daysToCheck = 42; //Going in Reverse
