/**
 * @author: Nader Hany info@infinitytech.ltd
 * @info: this application is a beautiful home assistant integration for
 *        publishing the home assistant devices states to thingsboard dashboard on the cloud
 */

const express = require("express");
const path = require("path");
const fs = require("fs");
const {
  setCfg,
  getCfg,
  getDevices,
  removeDeviceByCid,
  addDevice,
  discover,
  getState,
  transformDevice,
  generateDeviceUrl,
  send2cloud,
  updateLastSeen
} = require("./utils");
const bodyParser = require("body-parser");
const { log } = require("console");

const app = express();

// Use body-parser middleware to parse JSON payloads
app.use(bodyParser.json());

// Logging middleware to check headers and body
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Set the static files directory
app.use(express.static(path.join(__dirname, "public")));

// Define the root route
app.get("/", (req, res) => {
  res.render("index", { title: "infinity cloud bridge" });
});

// Setting configuration route
app.post("/config", (req, res) => {
  console.log("Request body in POST /config:", req.body);
  setCfg(req.body.token, req.body.broker, req.body.getway);
  res.send({ msg: "OK" });
});

// Getting configuration route
app.get("/config", (req, res) => {
  res.send(getCfg());
});

// get the whole devices inistances
app.get("/devices", (req, res) => {
  res.send(getDevices());
});

// delete device by id
app.delete("/devices/:cid", (req, res) => {
  const cid = req.params.cid;
  console.log(cid);
  removeDeviceByCid(cid);
  res.send({ msg: "ok" });
});

// add new device
app.post("/devices", (req, res) => {
  addDevice(req.body);
  res.send({ msg: "ok" });
});

// will discover the devices in home assistant api
app.get("/discover", async (req, res) => {
  try {
    const x = await discover();
    console.log("discovered:", x);
    res.send(x);
  } catch (error) {
    console.error("Error in /discover route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// will get a device state from home assistant api
app.get("/device/:id", async (req, res) => {
  try {
    const x = await getState(req.params.id);
    console.log("discovered:", x);
    res.send(x);
  } catch (error) {
    console.error("Error in /discover route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * in this thread we will get all registered devices status
 * and then send it to the thingsboard cloud .
 *
 * 1- need to get all devices registered
 * 2- foreach device:-
 *    0- update device last seen
 *    1- transform the device telementary
 *    2- generate its url
 *    3- send to the cloud
 */
 function thread() {
  try {
    console.log("updating devices on the cloud ....");

    let xa = getDevices();
    xa.forEach(async(device) => {
      updateLastSeen(device);
      var data=await transformDevice(device);
      var devUrl= generateDeviceUrl(device.cid);
      await send2cloud(devUrl,data)
      // console.log(a);
    });
    console.log("success");
  } catch (error) {
    console.log("invlid cloud id.....");
  }
}

// Set interval to run logHelloWorld function every 1000 ms (1 second)
setInterval(thread, 1000);
