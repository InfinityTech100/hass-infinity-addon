/**
 * @author: Nader Hany info@infinitytech.ltd
 *
 */

const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

// Function to set the configuration
function setCfg(hname,token, broker, ebroker,gateway) {
  try {
    const configFilePath = path.join(__dirname, "data", "config.json");
    const config = {
      hubname:hname,
      token: token,
      broker: broker,
      external_broker: ebroker,
      getway: gateway,
    };

    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf8");
    console.log("Configuration updated successfully.");
  } catch (error) {
    console.log(error);
  }
}

// Function to get the configuration
function getCfg() {
  try {
    const configFilePath = path.join(__dirname, "data", "config.json");
    if (!fs.existsSync(configFilePath)) {
      console.error("Configuration file does not exist.");
      return null;
    }

    const configData = fs.readFileSync(configFilePath, "utf8");
    return JSON.parse(configData);
  } catch (error) {
    console.log(error);
  }
}

// Function to get the configuration
function getDevices() {
  try {
    const configFilePath = path.join(__dirname, "data", "devices.json");
    if (!fs.existsSync(configFilePath)) {
      console.error("Configuration file does not exist.");
      return null;
    }

    const configData = fs.readFileSync(configFilePath, "utf8");
    return JSON.parse(configData);
  } catch (error) {
    console.log(error);
  }
  return null;
}

function removeDeviceByCid(cidToRemove) {
  try {
    let deviceList = getDevices();
    deviceList = deviceList.filter((device) => device.cid !== cidToRemove); // Assign the filtered array back to deviceList
    const configFilePath = path.join(__dirname, "data", "devices.json");
    fs.writeFileSync(
      configFilePath,
      JSON.stringify(deviceList, null, 2),
      "utf8"
    );
    console.log("Devices updated successfully.", deviceList);
  } catch (error) {
    console.log(error);
  }
}

function addDevice(device) {
  try {
    let deviceList = getDevices();
    deviceList.push(device);
    const configFilePath = path.join(__dirname, "data", "devices.json");
    fs.writeFileSync(
      configFilePath,
      JSON.stringify(deviceList, null, 2),
      "utf8"
    );
    console.log("Devices added successfully.", deviceList);
  } catch (error) {
    console.log(error);
  }
}

async function discover() {
  try {
    const token = getCfg().token; // Assuming getCfg() retrieves the token
    // console.log(`token ${token}`);

    const url = "http://127.0.0.1:8123/api/states";
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    //console.log("Response:", response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error:", error);
    return {}; // Return an empty object or handle the error accordingly
  }
}

async function getState(device) {
  try {
    const token = getCfg().token; // Assuming getCfg() retrieves the token
    // console.log(`token ${token}`);

    const url = `http://127.0.0.1:8123/api/states/${device}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // console.log("Response:", response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error:");
    return {}; // Return an empty object or handle the error accordingly
  }
}

// Transform function
async function transformDevice(obj) {
  const { name, type, properties } = obj;

  // Use Promise.all to await all async operations inside map
  const telementary = await Promise.all(
    properties.map(async (prop) => {
      const stateResponse = await getState(prop.hass);
      const state = stateResponse.state; // Access the state property from the response object
      return { [prop.cloud]: state };
    })
  );

  // Construct the transformed object with the desired structure
  const transformedObject = {
    deviceName: name,
    deviceType: type,
    telementary: Object.assign({}, ...telementary), // Flatten the array of objects into a single object
  };

  return transformedObject;
}

function generateDeviceUrl(device) {
  let baseurl = getCfg().getway;
  baseurl = baseurl.replace("<device_id>", device);
  // console.log(baseurl);
  return baseurl;
}

// Function to update a device by its CID
function updateDevice(cid, updatedDeviceData) {
  // Read the JSON file
  const filePath = path.join(__dirname, "data", "devices.json");
  const rawData = fs.readFileSync(filePath);
  let devices = JSON.parse(rawData);

  // Find the device object by its CID
  const deviceToUpdate = devices.find((device) => device.cid === cid);
  if (!deviceToUpdate) {
    console.log(`Device with CID '${cid}' not found.`);
    return;
  }

  // Update the device object with new data
  Object.assign(deviceToUpdate, updatedDeviceData);

  // Write the updated JSON back to the file
  fs.writeFileSync(filePath, JSON.stringify(devices, null, 2));

  console.log(`Device with CID '${cid}' updated successfully.`);
}

async function updateLastSeen(device) {
  try {
    let x = getState(device.properties[0].hass).last_updated;
    device.lastSeen = x;
    device.state = "online";
    updateDevice(device.cid, device);
  } catch (error) {
    device.lastSeen = "";
    device.state = "unavailable";
    updateDevice(device.cid, device);
  }
}

async function send2cloud(deviceUrl, data) {
  try {
    console.log("sending : ",deviceUrl);
    console.log("data : ",data);

    const response = await axios.post(deviceUrl, data, {
      headers: {
        "Content-Type": "application/json",
        // Add any other headers as needed
      },
    });

    // console.log(
    //   `Data sent successfully to ${deviceUrl}. Response:`,
    //   response.data
    // );
    return response.data;
  } catch (error) {
    console.error(`Error sending data to ${deviceUrl}:`, error);
  }
}

module.exports = {
  setCfg,
  getCfg,
  getDevices,
  removeDeviceByCid,
  addDevice,
  discover,
  getState,
  transformDevice,
  generateDeviceUrl,
  updateLastSeen,
  send2cloud,
};
