import * as config from "./config";
import * as strand from "./strand";
import * as animations from "./animations";
import * as constants from "./constants";
import * as audio from "./audio";

let runnerInterval;
let navInterval;
let runningAnimations = [];
let runningNavigations = [];
let runningNavigation = 0;
let pixelData = new Uint32Array(config.LED_COUNT);

function startAnimator() {
  runnerInterval = setInterval(runner, config.ANIMATION_TICK_INTERVAL);
  navInterval = setInterval(navSwitcher, 2500);
}

function stopAnimator() {
  if (runnerInterval) {
    clearInterval(runnerInterval);
    clearInterval(navInterval);
  }
  runnerInterval = undefined;
  navInterval = undefined;
}

export function startAnimation(id, type, params, from, to) {
  // Sanity check
  stopAnimation(id, true);

  if(!runnerInterval){
    startAnimator();
  }
  if(type === 'navigation') {
    runningNavigations.push(animations.getAnimation(id, config.NAVIGATION_ANIMATION, params, from, to));
  } else {
    runningAnimations.push(animations.getAnimation(id, type, params, from, to));
  }
}

export function stopAnimation(id, clear) {
  let animation = runningAnimations.find((animation) => animation.id === id);
  if(animation) {
    runningAnimations = runningAnimations.filter((animation) => animation.id !== id);
    if (clear !== false) {
      animations.clearAnimation(pixelData, animation);
    }
    return true;
  } else {
    animation = runningNavigations.find((animation) => animation.id === id);
    if(animation) {
      runningNavigations = runningNavigations.filter((animation) => animation.id !== id);
      if (clear !== false) {
        animations.clearAnimation(pixelData, animation);
      }
      return true;
    }
  }
  return false;
}

export function stopAllAnimations(clear) {
  runningAnimations = [];
  runningNavigations = [];

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
  if(runningNavigations.length > 0){
    runningNavigations[runningNavigation].tick(pixelData);
  }
  strand.render(pixelData);
}

function navSwitcher() {
  if(runningNavigations.length === 0 || runningNavigation >= runningNavigations.length) {
    runningNavigation = 0;
  }

  if(runningNavigations.length > 1) {
    animations.clearAnimation(pixelData, runningNavigations[runningNavigation]);
    if (runningNavigations.length > (runningNavigation + 1)) {
      runningNavigation++;
    } else if (runningNavigations.length === (runningNavigation + 1)) {
      runningNavigation = 0;
    }
  }
}
