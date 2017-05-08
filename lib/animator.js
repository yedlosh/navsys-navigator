import * as config from "./config";
import * as strand from "./strand";
import * as animations from "./animations";

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

export function startAnimation(id, type, color, from, to) {
  // Sanity check
  stopAnimation(id);

  if(!runnerInterval){
    startAnimator();
  }
  runningAnimations.push(animations.getAnimation(id, type, color, from, to));
}

export function stopAnimation(id, clear) {
  const animation = runningAnimations.filter((animation) => animation.id !== id).length > 0;
  if(animation.length > 0 && clear !== false) {
    animations.clearAnimation(pixelData, animation);
  }
  return animation.length > 0;
}

export function stopAllAnimations() {
  runningAnimations = {};
}

export function runner() {
  if(runningAnimations.length > 0){
    runningAnimations.forEach((animation) => animation.tick(pixelData));
  }
  strand.render(pixelData);
}
