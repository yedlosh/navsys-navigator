//Start navigating
import * as animator from "./animator";
import * as config from "./config";
import * as constants from "./constants";
import * as animations from "./animations";
import * as audio from "./audio";

export function navigate(req, res, next) {
  const {userId, from, to, color, alert} = req.body;

  //Verify we have all valid parameters needed
  if (
    userId &&
    color &&
    //(config.LED_LAYOUT.hasOwnProperty(to) || config.LED_LAYOUT.hasOwnProperty(from)) &&
    (from ? config.LED_LAYOUT.hasOwnProperty(from) : true)
  ) {
    try {
      animator.startAnimation(userId, constants.NAVIGATION_ANIMATION_TYPE, {color, alert}, from, to);
      res.status(200).json({success: "Animation started"});
    } catch (err) {
      res.status(500).json({error: "Animation failed to start!", message: err});
    }
  } else {
    res.status(400).json({error: "Parameters missing or invalid!"});
  }
}

//Stop running navigation / show
export function stop(req, res, next) {
  let animationId = req.params.id;
  const {clear} = req.body;

  if (animationId) {
    // Stop all animations
    if(animationId.toLowerCase() === 'all'){
      animator.stopAllAnimations(clear !== 'false');
      res.status(200).json({success: "Animation stopped"});
    } else if (animator.stopAnimation(animationId, clear !== 'false')) {
      res.status(200).json({success: "Animation stopped"});
    } else {
      res.status(200).json({success: "Animation was not running!"});
    }
  } else {
    res.status(400).json({error: "Animation ID required!"});
  }
}

//Show off
export function show(req, res, next) {
  const {animationId, animationType, from, to, params} = req.body;

  if (
    animationId &&
    animations.animationExists(animationType) &&
    (from ? config.LED_LAYOUT.hasOwnProperty(from) : true) &&
    (to ? config.LED_LAYOUT.hasOwnProperty(to) : true)
  ) {
    try {
      animator.startAnimation(animationId, animationType, params ? params : {}, from, to);
      res.status(200).json({success: "Animation started", id: animationId});
    } catch (err) {
      res.status(400).json({error: "Animation failed to start!", message: err.message});
    }
  }
  else {
    res.status(400).json({error: "Parameters missing or invalid!"});
  }
}

//Play audio
export function playAudio(req, res, next) {
  const {filename} = req.body;

  if (filename) {
    try {
      audio.play(filename);
      res.status(200).json({success: "Playing file", filename: filename});
    } catch (err) {
      res.status(400).json({error: "Audio failed to start!", message: err});
    }
  }
  else {
    res.status(400).json({error: "Parameters missing or invalid!"});
  }
}

//Stop audio
export function stopAudio(req, res, next) {
  try {
    audio.stop();
    res.status(200).json({success: "Audio Stopped!"});
  } catch (err) {
    res.status(400).json({error: "Audio failed to stop!", message: err});
  }
}
