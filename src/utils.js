const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

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

// Function to get the configuration
function getDevices() {
  const configFilePath = path.join(__dirname, "data", "devices.json");
  if (!fs.existsSync(configFilePath)) {
    console.error("Configuration file does not exist.");
    return null;
  }

  const configData = fs.readFileSync(configFilePath, "utf8");
  return JSON.parse(configData);
}

function removeDeviceByCid(cidToRemove) {
  let deviceList = getDevices();
  deviceList = deviceList.filter((device) => device.cid !== cidToRemove); // Assign the filtered array back to deviceList
  const configFilePath = path.join(__dirname, "data", "devices.json");
  fs.writeFileSync(configFilePath, JSON.stringify(deviceList, null, 2), "utf8");
  console.log("Devices updated successfully.", deviceList);
}

function addDevice(device) {
  let deviceList = getDevices();
  deviceList.push(device);
  const configFilePath = path.join(__dirname, "data", "devices.json");
  fs.writeFileSync(configFilePath, JSON.stringify(deviceList, null, 2), "utf8");
  console.log("Devices added successfully.", deviceList);
}
async function discover() {
  try {
    const token = getCfg().token; // Assuming getCfg() retrieves the token
    console.log(`token ${token}`);
    
    const url = "http://127.0.0.1:8123/api/states";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    console.log("Response:", response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error:", error);
    return {}; // Return an empty object or handle the error accordingly
  }
}

module.exports = {
  setCfg,
  getCfg,
  getDevices,
  removeDeviceByCid,
  addDevice,
  discover,
};
