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
    //   console.log(parts);
    const lastElement = parts.pop(); // Remove the last element
    let result = "";

    // Rebuild the string excluding the last element if it matches device_class
    parts.forEach((part, index) => {
      result += (index > 0 ? "_" : "") + part;
    });

    // Check if the last element should be added back
    if (lastElement !== item.device_class) {
      result += (result ? "_" : "") + lastElement;
    }
    return {
      entity_id: item.entity_id,
      device_class: item.device_class,
      processed: result,
    };
  });

  // Step 2: Group elements by the 'processed' field
  const grouped = newList.reduce((acc, item) => {
    const { processed, entity_id } = item;
    if (!acc[processed]) {
      acc[processed] = [];
    }
    acc[processed].push(entity_id);
    return acc;
  }, {});

  // Step 3: Create the final merged list
  const mergedList = Object.entries(grouped).map(([processed, ids]) => {
    return {
      ids: ids,
      name: processed,
    };
  });
  return mergedList;
}

// console.log("**********************");
// console.log(parseDevices(xp));
module.exports=parseDevices;