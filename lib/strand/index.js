import rangeInclusive from 'range-inclusive';
import * as config from "../config";
import ws281x from "./ws281x";
import ws2801 from "./ws2801";

let driver;
let initialized = false;

export function init() {
  switch(config.LED_TYPE) {
    case 'WS2812':
      driver = ws281x;
      break;
    case 'WS2801':
      driver = ws2801;
      break;
    default:
      console.error("No valid LED type was defined!");
  }

  driver.init();
  initialized = true;
}

export function render(pixelData){
  if(initialized) {
    driver.render(pixelData);
  }
}

export function reset(){
  if(initialized) {
    driver.reset();
  }
}

// export function setBrightness(brightness) {
//   ws281x.setBrightness(brightness);
// }

/* LED Layout is stored in form:
 {
   segment: [centerAddress, endingAddress]
 }
 That is first index is always the inner address.
 Unless we have only one segment - in that case they will be overlapping:
  {0: [10,0], 1:[0,10]}
*/
export function getAnimationAddressMap(from, to) {
  let addressingMap;

  if(!from && from !== 0 && !to && to !== 0){
    //If nothing is given we address over the whole strip
    addressingMap = rangeInclusive(0, config.LED_COUNT - 1);
  } else if(!from && from !== 0) {
    //If we don't know from where, we address only the 'to' segment
    const toSegment = config.LED_LAYOUT[to];
    addressingMap = rangeInclusive(toSegment[0], toSegment[1], toSegment[0] < toSegment[1] ? 1 : -1);
  } else if (!to && to !== 0) {
    //If we don't know to where, we address only the 'from' segment
    const fromSegment = config.LED_LAYOUT[from];
    addressingMap = rangeInclusive(fromSegment[1], fromSegment[0], fromSegment[1] < fromSegment[0] ? 1 : -1);
  } else if(from !== to){
    // We know from to - invert from range (as it's configured center -> ending) and spread ranges to array
    const fromSegment = config.LED_LAYOUT[from];
    const toSegment = config.LED_LAYOUT[to];
    const fromSegmentRange = rangeInclusive(fromSegment[1], fromSegment[0], fromSegment[1] < fromSegment[0] ? 1 : -1);
    const toSegmentRange = rangeInclusive(toSegment[0],toSegment[1], toSegment[0] < toSegment[1] ? 1 : -1);

    //Check if we actually don't have only one overlapped segment
    if(fromSegmentRange[0] === toSegmentRange[0]) {
      addressingMap = [...toSegmentRange];
    } else {
      addressingMap = [...fromSegmentRange, ...toSegmentRange];
    }
  } else {
    return undefined;
  }

  return addressingMap;
}

export function getEndingPixels() {
return Object.values(config.LED_LAYOUT).map(segment => segment[1]);
}
