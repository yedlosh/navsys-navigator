import ws2801 from 'rpi-ws2801';
import * as config from "../config";

export default {
  init: () => {
    ws2801.connect(Number(config.LED_COUNT));
  },

  render: (pixelData) => {
    const rgbData = pixelData.reduce((acc, hexPixel) => {
      const rgb = hexToRGB(hexPixel);
      acc.push(rgb[0]);
      acc.push(rgb[1]);
      acc.push(rgb[2]);
      return acc;
    }, []);
    ws2801.sendRgbBuffer(rgbData);
  },

  reset: () => {
    ws2801.clear();
    ws2801.disconnect();
  }
}

function hexToRGB(hex){
  const r = hex >> 16;
  const g = hex >> 8 & 0xFF;
  const b = hex & 0xFF;
  return [r,g,b];
}
