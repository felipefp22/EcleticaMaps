const fs = require('fs');
const path = require('path');

// Path to the config file
const configFilePath = path.join(__dirname, 'myVariables.json');

// Function to read data from the JSON file
function readConfig() {
  const data = fs.readFileSync(configFilePath, 'utf8');
  return JSON.parse(data); // Parse JSON into JavaScript object
}

// Function to write updated data to the JSON file
function writeConfig(updatedData) {
  fs.writeFileSync(configFilePath, JSON.stringify(updatedData, null, 2)); // Convert object to JSON and save it
}

module.exports = {
  readConfig,
  writeConfig
};