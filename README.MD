# infinity Home Assistant Cloude Bridge add-ons

this is an add on designed for home assistant to bridge its devices to a things board custom dashboard.

<img src="screenshots/Screenshot from 2024-07-08 04-00-55.png" >
<img src="screenshots/Screenshot from 2024-07-08 04-01-08.png" >
<img src="screenshots/Screenshot from 2024-07-08 04-01-18.png" >
<img src="screenshots/Screenshot from 2024-07-08 04-01-25.png" >

## testing and validation
<video width="640" height="360" controls>
  <source src="https://github.com/InfinityTech100/hass-infinity-addon/blob/main/screenshots/videos/infinityhassaddon-2024-07-08_04.03.10.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>


## installation on home assitant 

you just need to install and rub it using the install script

```bash
./install.sh
```

after that you need to add it to the configuration.yaml file for home assistant


```yaml
panel_iframe:
  home_cloud:
    title: "infinity cloud"
    url: "http://127.0.0.1:3000"
    icon: mdi:internet
    require_admin: true
```

## Setting up the integration 

you need to generate access token from the home assistant user -> security -> longlive access token and then paste it to our setting integration page
, you can follow the video like that :-

<video width="640" height="360" controls>
  <source src="https://github.com/InfinityTech100/hass-infinity-addon/blob/main/screenshots/videos/infinityhassaddonsetting-2024-07-08_04.06.45.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>



## results 

a beautiful home assistant integration and easy to maintain


## Todo

1- make it based on a docker container.<br>
2- fix the last seen bug.<br>
3- add dialog that indicate a device added succesfully.<br>
4- ??