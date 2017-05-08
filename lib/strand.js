import ws281x from 'rpi-sk6812-native';
import rangeInclusive from 'range-inclusive';
import * as config from "./config";

if(config.INIT_LED) {
  const options = {
    frequency: 800000,
    dmaNum: 5,
    gpioPin: 18,
    invert: false,
    brightness: 255,
    strip_type: ws281x.STRIP_TYPES.WS2812
  };
  ws281x.init(Number(config.LED_COUNT), options);
}

export function render(pixelData){
  ws281x.render(pixelData);
}

export function reset(){
  ws281x.reset();
}

export function setBrightness(brightness) {
  ws281x.setBrightness(brightness);
}

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
    addressingMap = rangeInclusive(config.LED_COUNT - 1);
  } else if(!from && from !== 0) {
    //If we don't know from where, we address only the 'to' segment
    const toSegment = config.LED_LAYOUT[to];
    addressingMap = rangeInclusive(toSegment[0], toSegment[1], toSegment[0] < toSegment[1] ? 1 : -1);
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
