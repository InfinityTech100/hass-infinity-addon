const mqtt = require("mqtt");
const { getCfg, getState } = require("./utils");


function publish2EBroker(device, data) {
  const client = mqtt.connect(getCfg().external_broker);

  client.on("connect", () => {
    console.log("Connected to MQTT Broker!");
      const topic = `${getCfg().hubname}/${device}`;
      const message = JSON.stringify(data);
      client.publish(topic, message, (err) => {
        if (err) {
          console.error(`Failed to send message to topic ${topic}`);
        } else {
          console.log(`Sent \`${message}\` to topic \`${topic}\``);
        }
      
    });
  });

  client.on("error", (err) => {
    console.error("Failed to connect:", err);
    client.end();
  });
}

async function getTelementary(ids) {
  let telementary = {};

  try {
    // Using Promise.all to await all async operations
    await Promise.all(
      ids.map(async (id) => {
        var x = await getState(id);
        telementary[x.attributes.device_class] = x.state;
      })
    );
    console.log(telementary);
  } catch (error) {
    console.log("key with the same name exists ...");
  }
  return telementary; // Returning the telementary object
}


async function generateDeviceData(ids, name) {
    const data = {
        deviceName: name,
        deviceType: getCfg().hubname,
        telementary: await getTelementary(ids), 
    };

    return data; // No need to await here, just return the object directly
}

module.exports = {
  publish2EBroker,
  getTelementary,
  generateDeviceData
};
