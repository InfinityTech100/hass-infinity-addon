const express = require("express");
const path = require("path");
const fs = require("fs");

// Function to set the configuration
function setCfg(token, broker, gateway) {
  const configFilePath = path.join(__dirname, "data", "config.json");
  const config = {
    token: token,
    broker: broker,
    getway: gateway,
  };

  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf8");
  console.log("Configuration updated successfully.");
}

// Function to get the configuration
function getCfg() {
  const configFilePath = path.join(__dirname, "data", "config.json");
  if (!fs.existsSync(configFilePath)) {
    console.error("Configuration file does not exist.");
    return null;
  }

  const configData = fs.readFileSync(configFilePath, "utf8");
  return JSON.parse(configData);
}

module.exports = {
  setCfg,
  getCfg,
};
