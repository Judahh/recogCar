# recogCar ![Build Status](https://travis-ci.com/.svg?token=yy4x23H8TG2tSgR4Bmgx&branch=master)

## Development

![Image of Development](https://github.com/institutoorion/HorusSystem/blob/master/Software.png)

## Installation

### Software

#### Visual Studio Code

[https://code.visualstudio.com/]

#### Git

##### Windows
[http://git-scm.com/download/win]

##### Linux
Fedora:
```sh
$ sudo dnf install git git-all
```
Debian/Ubuntu:
```sh
$ sudo apt-get install git git-all
```

### Project

```sh
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
nvm install node
npm install -g typescript
npm install -g concurrently	
npm install
npm run tsc
npm run webpack
```

## App

It uses the framework backApp [https://github.com/Judahh/backApp]

### Code

#### listVideos
Code to list video files stored on the device. It is displayed on the playback screen. Used in the 'playback.json' frame.
#### selectVideos
Code to select a video file stored on the device. It is displayed on the playback screen. Used in the 'playback.json' frame.
#### stream
#### time 
Code to show the clock time. It is displayed at the top of the display. Used in the frame 'header.json'.
#### uptime
Code to show system uptime. It is displayed on the battery status screen. Used in the 'energy.json'.
#### wifi
Code to show wifi networks availables. It is displayed on the wifi screen in connectivity config. Used in the 'wifi.json'.

#### gPS

### Frame

#### home
#### header
#### footer
#### menu
#### config
##### cameraSettings
##### connectivity
###### wifi
##### regionalSettings
###### data
###### language
##### sound
##### battery
##### display
##### server
#### storage
#### playback
#### energy
#### gps

### Icon

In this folder is where icon are stored.

### Images

In this folder is where images are stored.

### Videos

## Api

It uses the framework backApp [https://github.com/Judahh/backApi]
