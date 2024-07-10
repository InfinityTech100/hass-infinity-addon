const mqtt = require('mqtt');

function publishDataToMqtt(data, broker, topic) {
    const client = mqtt.connect(broker);

    client.on('connect', () => {
        console.log("Connected to MQTT Broker!");

        data.forEach(entity => {
            const entityTopic = `${topic}/${entity.entity_id}`;
            const message = JSON.stringify({ state: entity.state });
            client.publish(entityTopic, message, (err) => {
                if (err) {
                    console.error(`Failed to send message to topic ${entityTopic}`);
                } else {
                    console.log(`Sent \`${message}\` to topic \`${entityTopic}\``);
                }
            });
        });
    });

    client.on('error', (err) => {
        console.error('Failed to connect:', err);
        client.end();
    });
}

module.exports = publishDataToMqtt;
