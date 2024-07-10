const axios = require("axios");
const mqtt = require("mqtt");
const HA_URL = "http://localhost:8123/api/states";
const HA_API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3YjI3OTU5MmE2NjI0OWUzOTVmODEyZWQyNjhiZjdlMyIsImlhdCI6MTcyMDYzNjg2MiwiZXhwIjoyMDM1OTk2ODYyfQ.tGl1rN2CSgbkP_SEa_4_qrE_2niB_I3OLmfkXOBSpgk";
const MQTT_BROKER = "mqtt://20.174.163.41:1234";
const MQTT_TOPIC = "homeassistant/states";

async function getDataFromRestApi() {
  try {
    const response = await axios.get(HA_URL, {
      headers: {
        Authorization: `Bearer ${HA_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.status : error.message
    );
    return null;
  }
}

function publishDataToMqtt(data) {
  const client = mqtt.connect(MQTT_BROKER);

  client.on("connect", () => {
    console.log("Connected to MQTT Broker!");

    data.forEach((entity) => {
      const topic = `${MQTT_TOPIC}/${entity.entity_id}`;
      const message = JSON.stringify({ state: entity.state });
      client.publish(topic, message, (err) => {
        if (err) {
          console.error(`Failed to send message to topic ${topic}`);
        } else {
          console.log(`Sent \`${message}\` to topic \`${topic}\``);
        }
      });
    });
  });

  client.on("error", (err) => {
    console.error("Failed to connect:", err);
    client.end();
  });
}
async function fetchDataAndPublish() {
  const data = await getDataFromRestApi();
  if (data) {
    publishDataToMqtt(data);
  }
}
setInterval(fetchDataAndPublish, 60000);
fetchDataAndPublish();
