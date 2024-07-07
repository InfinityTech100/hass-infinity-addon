const express = require("express");
const path = require("path");
const fs = require("fs");
const { setCfg, getCfg, getDevices, removeDeviceByCid, addDevice } = require("./utils");
const bodyParser = require('body-parser');

const app = express();

// Use body-parser middleware to parse JSON payloads
app.use(bodyParser.json());

// Logging middleware to check headers and body
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
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
  console.log('Request body in POST /config:', req.body);
  setCfg(req.body.token, req.body.broker, req.body.getway);
  res.send({ msg: "OK" });
});

// Getting configuration route
app.get("/config", (req, res) => {
  res.send(getCfg());
});

app.get("/devices",(req, res) => {
  res.send(getDevices());
});

app.delete("/devices/:cid",(req, res) => {
  const cid=req.params.cid;
  console.log(cid);
  removeDeviceByCid(cid);
  res.send({msg:"ok"});
});

app.post("/devices/",(req, res) => {

  addDevice(req.body);
  res.send({msg:"ok"});
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
