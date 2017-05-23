import * as config from "./config";
import * as strand from "./strand";
import * as animations from "./animations";
import * as constants from "./constants";

let runnerInterval;
let runningAnimations = [];
let pixelData = new Uint32Array(config.LED_COUNT);

function startAnimator() {
  runnerInterval = setInterval(runner, config.ANIMATION_TICK_INTERVAL);
}

function stopAnimator() {
  if (runnerInterval) {
    clearInterval(runnerInterval);
  }
  runnerInterval = undefined;
}

export function startAnimation(id, type, params, from, to) {
  // Sanity check
  stopAnimation(id, true);

  if(!runnerInterval){
    startAnimator();
  }
  runningAnimations.push(animations.getAnimation(id, type, params, from, to));
}

export function stopAnimation(id, clear) {
  const animation = runningAnimations.find((animation) => animation.id === id);
  if(animation) {
    runningAnimations = runningAnimations.filter((animation) => animation.id !== id);
    if (clear !== false) {
      animations.clearAnimation(pixelData, animation);
    }
    return true;
  }
  return false;
}

export function stopAllAnimations(clear) {
  runningAnimations = [];
  if(clear !== false) {
    animations.clearAll(pixelData);
  }

  if(config.SHOW_ENDINGS) {
    startAnimation(constants.ENDINGS_WARNING_ANIMATION_ID, 'endings', {color: constants.ENDINGS_WARNING_COLOR});
  }

  return true;
}

export function runner() {
  if(runningAnimations.length > 0){
    runningAnimations.forEach((animation) => animation.tick(pixelData));
  }
  strand.render(pixelData);
}
