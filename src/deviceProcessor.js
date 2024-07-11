const { log } = require("console");
const fs = require("fs");
const path = require("path");

/**
 * 1- get all devices by (entity_id , device_class)
 * 2- split at . delimeter
 * 3- split at _ delimter
 * 4- replace the last element with '' if it is equal to device_class
 * 5- foreach device with same process merge it with the same (ids:[],name)
 * 
 * example:
      [
         { ids: [ 'sensor.sun_next_dawn' ], name: 'sun_next_dawn' },
         { ids: [ 'sensor.sun_next_dusk' ], name: 'sun_next_dusk' },
         { ids: [ 'sensor.sun_next_midnight' ], name: 'sun_next_midnight' },
         { ids: [ 'sensor.sun_next_noon' ], name: 'sun_next_noon' },
         { ids: [ 'sensor.sun_next_rising' ], name: 'sun_next_rising' },
         { ids: [ 'sensor.sun_next_setting' ], name: 'sun_next_setting' },
         {
            ids: [
               'binary_sensor.smoke_detector1_smoke',
               'binary_sensor.smoke_detector1_tamper',
               'sensor.smoke_detector1_battery'
            ],
            name: 'smoke_detector1'
         },
         { ids: [ 'binary_sensor.smoke_alarm2_smoke' ], name: 'smoke_alarm2' },
         {
            ids: [ 'sensor.th_zone04_temperature', 'sensor.th_zone04_humidity' ],
            name: 'th_zone04'
         }
      ]
 * 
 * 
 * @param {*} x 
 * @returns 
 */
function parseDevices(x) {
  const simplifiedList = x
    .map((item) => {
      if (item.attributes && item.attributes.device_class) {
        return {
          entity_id: item.entity_id,
          device_class: item.attributes.device_class,
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  const newList = simplifiedList.map((item) => {
    const parts = item.entity_id.split(".")[1].split("_");
    const lastElement = parts.pop();
    let result = parts.join("_");
    if (lastElement !== item.device_class) {
      result += (result ? "_" : "") + lastElement;
    }
    return {
      entity_id: item.entity_id,
      device_class: item.device_class,
      processed: result,
    };
  });

  const grouped = newList.reduce((acc, item) => {
    const { processed, entity_id, device_class } = item;
    if (!acc[processed]) {
      acc[processed] = {
        ids: [],
        device_class: device_class,
      };
    }
    acc[processed].ids.push(entity_id);
    return acc;
  }, {});

  const mergedList = Object.entries(grouped).map(
    ([processed, { ids, device_class }]) => ({
      ids,
      name: processed,
      device_class,
    })
  );

  return mergedList;
}

// console.log("**********************");
// console.log(parseDevices(xp));


module.exports = {
  parseDevices,
};
