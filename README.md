# navsys-navigator

**navsys** is a thesis project, which aims to provide an indoor navigation solution with audiovisual feedback, 
using a combination of smartphone based WiFi positioning and physical navigation units. 
For a documentation of the whole project see [navsys-docs](https://github.com/yedlosh/navsys-docs) repository.

## Navigator

Navigation units powered by Raspberry Zero W, equipped with digital LED strips. Based on Express.JS as well, 
they are exposing a REST interface for accepting commands.

### Environment

The navigator server needs npm and node.js to install and run. While this goes without thinking on regular machines, 
it might be needed to point out here, as Raspbian does not include these. 
For Raspberry Zero W the Node.js compiled for ARM v6 has to be used.

### Installation

The navigator server is set up as an npm package. Simply install all package dependencies with
```bash
$ npm install
```

### TODO Configuration
#### System
* network setup
* start in local.rc
#### .env file
* setting values
* strip endings 

### LED signs
The navigator unit is supposed to have some digital LED strip connected, which acts as the navigation sign.
Currently WS2801 and WS2812 strips are supported and tested to work. As these LED drivers operate at 5V and Raspberry runs at 3.3V, a logic level shifter has to be used. Any generic one will do. Another option is to run the LED strip at the 3.3V as well, which should work but at the cost of losing quite a lot of brightness.
