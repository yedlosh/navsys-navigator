import ws281x from 'rpi-sk6812-native';
import * as config from "../config";

export default {
  init: () => {
    const options = {
      frequency: 800000,
      dmaNum: 5,
      gpioPin: 18,
      invert: false,
      brightness: 255,
      strip_type: ws281x.STRIP_TYPES.WS2812
    };
    ws281x.init(Number(config.LED_COUNT), options);
  },

  render: (pixelData) => {
    ws281x.render(pixelData);
  },

  reset: () => {
    ws281x.reset();
  },

  setBrightness: (brightness) => {
    ws281x.setBrightness(brightness);
  }
}
