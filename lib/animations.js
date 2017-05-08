/**
 https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
 * h is in range [0 - 360]
 * s, and v are contained in range [0 - 1]
 * returns r, g, and b in range [0 - 255]
 */
import * as config from "./config";
import * as strand from "./strand";

const animations = {
  rainbow: function (addressing)
  {
    let cwi = 0;
    return function (pixelData) {
      if (++cwi > 255) {
        cwi = 0;
      }
      for (let i = addressing.length - 1; i >= 0; i--) {
        pixelData[addressing[i]] = colorWheel((cwi + i) & 255);
      }
    }
  }
};

export function getAnimation(id, type, color, from, to){
  const addressing = strand.getAnimationAddressMap(from, to);
return {
  id,
  type,
  color,
  from,
  to,
  addressing,
  tick: animations[type](addressing)
}
}

export function clearAnimation(pixelData, animation) {
  const {addressing} = animation;
  for (let i = 0; i < addressing.length; i++) {
    pixelData[addressing[i]] = 0x000000;
  }
}

function hsvToRgb(h, s, v){
  let r, g, b;

  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch(i % 6){
    case 0:
      r = v; g = t; b = p;
      break;
    case 1:
      r = q; g = v; b = p;
      break;
    case 2:
      r = p; g = v; b = t;
      break;
    case 3:
      r = p; g = q; b = v;
      break;
    case 4:
      r = t; g = p; b = v;
      break;
    case 5:
      r = v; g = p; b = q;
      break;
  }

  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

// Input a value 0 to 255 to get a color value.
// The colors are a transition r - g - b - back to r.
function colorWheel( WheelPos ){
  let r, g, b;
  WheelPos = 255 - WheelPos;

  if ( WheelPos < 85 ) {
    r = 255 - WheelPos * 3;
    g = 0;
    b = WheelPos * 3;
  } else if (WheelPos < 170) {
    WheelPos -= 85;
    r = 0;
    g = WheelPos * 3;
    b = 255 - WheelPos * 3;
  } else {
    WheelPos -= 170;
    r = WheelPos * 3;
    g = 255 - WheelPos * 3;
    b = 0;
  }
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

function rgbToHex(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
