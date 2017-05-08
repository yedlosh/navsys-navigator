//Start navigating
import * as animator from "./animator";
import * as config from "./config";
import * as constants from "./constants";
var util = require('util');

export function navigate(req, res, next) {
  const {userId, from, to, color} = req.body;

  //Verify we have all valid parameters needed
  if (
    userId &&
    color &&
    to &&
    config.LED_LAYOUT.hasOwnProperty(to) &&
    (from ? config.LED_LAYOUT.hasOwnProperty(from) : true)
  ) {
    animator.startAnimation(userId, constants.NAVIGATION_ANIMATION_TYPE, color, from, to);
    res.status(200).json({success: "Animation started"});
  } else {
    res.status(400).json({error: "Parameters missing or invalid"});
  }
}

//Stop running navigation / show
export function stop(req, res, next) {
  const {animationId, clear} = req.body;

  if(animationId) {
    if(animator.stopAnimation(animationId, clear !== 'false')){
      res.status(200).json({success: "Animation stopped"});
    } else {
      res.status(404).json({error: "Animation was not found"});
    }
  } else {
    res.status(400).json({error: "Animation ID required"});
  }
}

//Show off
export function show(req, res, next) {
  const {animationId, animationType, from, to, color} = req.body;

  if (
    animationId &&
    constants.ANIMATION_TYPES.includes(animationType) &&
    (from ? config.LED_LAYOUT.hasOwnProperty(from) : true) &&
    (to ? config.LED_LAYOUT.hasOwnProperty(to) : true)
  ) {
    animator.startAnimation(animationId, animationType, color, from, to);
    res.status(200).json({success: "Animation started"});
  } else {
    res.status(400).json({error: "Parameters missing or invalid"});
  }
}
