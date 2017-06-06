import * as config from "./config";
import * as strand from "./strand";
import * as constants from "./constants";

/*
Animation Blueprint
name: function (addressing, params) {
 return function (pixelData) {
  for (let i = 0; i < addressing.length; i++) {
    pixelData[addressing[i]] = [MAGIC HAPPENS HERE]
  }
 }
}
 */
const animations = {
  rainbow: function (addressing) {
    let cwi = 0;
    return function (pixelData) {
      if (++cwi > 255) {
        cwi = 0;
      }
      for (let i = 0; i < addressing.length; i++) {
        pixelData[addressing[i]] = colorWheel((cwi - i) & 255);
      }
    }
  },
  navigation: function (addressing, params) {
    const color = parseIntParam(params.color);
    const alert = parseBoolParam(params.alert);
    let step = -1;
    let alertCount = 0;

    return function (pixelData) {
      if (++step > 4) {
        step = 0;
      }
      if(++alertCount > 66) {
        alertCount = 0;
      }
      if(!alert || alertCount < 40) {
        for (let i = 0; i < addressing.length; i++) {
          //pixelData[addressing[i]] = shadeColor(color, - 1 / ((i - step) & 5));
          pixelData[addressing[i]] = shadeColor(color, -1 / (0.01 + (Math.abs(i - step) % 5)));
        }
      } else {
        for (let i = 0; i < addressing.length; i++) {
          pixelData[addressing[i]] = constants.ALERT_WARNING_COLOR;
        }
      }
    }
  },
  solid: function (addressing, params) {
    const color = parseIntParam(params.color);

    return function (pixelData) {
      for (let i = 0; i < addressing.length; i++) {
        pixelData[addressing[i]] = color;
      }
    }
  },
  endings: function (addressing, params) {
    const color = parseIntParam(params.color);
    const endingPixels = strand.getEndingPixels();
    return function (pixelData) {
      for (let i = 0; i < endingPixels.length; i++) {
        pixelData[endingPixels[i]] = color;
      }
    }
  }
};

export function animationExists(animationType) {
  return animations.hasOwnProperty(animationType);
}

export function getAnimation(id, type, params, from, to) {
  const addressing = strand.getAnimationAddressMap(from, to);
  return {
    id,
    type,
    params,
    from,
    to,
    addressing,
    tick: animations[type](addressing, params)
  }
}

export function clearAll(pixelData) {
  for (let i = 0; i < pixelData.length; i++) {
    pixelData[i] = 0x000000;
  }
}

export function clearAnimation(pixelData, animation) {
  const {addressing} = animation;
  for (let i = 0; i < addressing.length; i++) {
    pixelData[addressing[i]] = 0x000000;
  }
}

function parseIntParam(param) {
  let paramInt;
  try {
    paramInt = parseInt(param);
  } catch (err) {
    throw new Error("Animation error: No or invalid color");
  }
  if(!paramInt) {
    throw new Error("Animation error: No or invalid color");
  }
  return paramInt;
}

function parseBoolParam(param) {
  let paramBool;
  try {
    if(typeof(param) !== "boolean")
      paramBool = JSON.parse(param.toLowerCase());
    else
      paramBool = param;
  } catch (err) {
    console.error("parseBoolParam: failed to parse boolean!");
  }
  return paramBool;
}

/**
 https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
 * h is in range [0 - 360]
 * s, and v are contained in range [0 - 1]
 * returns r, g, and b in range [0 - 255]
 */
function hsvToRgb(h, s, v) {
  let r, g, b;

  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

// Input a value 0 to 255 to get a color value.
// The colors are a transition r - g - b - back to r.
function colorWheel(WheelPos) {
  let r, g, b;
  WheelPos = 255 - WheelPos;

  if (WheelPos < 85) {
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

function hexToRGB(hex){
  const r = hex >> 16;
  const g = hex >> 8 & 0xFF;
  const b = hex & 0xFF;
  return [r,g,b];
}

function shadeColor(color, percent) {
  const
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = color >> 16,
    G = color >> 8 & 0x00FF,
    B = color & 0x0000FF;
  return ((Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B));
}

function blendColors(c0, c1, p) {
  const
    R1 = c0 >> 16, G1 = c0 >> 8 & 0x00FF, B1 = c0 & 0x0000FF,
    R2 = c1 >> 16, G2 = c1 >> 8 & 0x00FF, B2 = c1 & 0x0000FF;
  return ((Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1));
}
