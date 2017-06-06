require('dotenv').config();

// App general config
export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = process.env.PORT || 5000;
export const ANIMATION_TICK_INTERVAL = process.env.ANIMATION_TICK_INTERVAL || 20;

// LED strip config
export const INIT_LED = JSON.parse(process.env.INIT_LED);
export const LED_COUNT = process.env.LED_COUNT;
export const LED_TYPE = process.env.LED_TYPE;
export const LED_LAYOUT = JSON.parse(process.env.LED_LAYOUT);
export const SHOW_ENDINGS = JSON.parse(process.env.SHOW_ENDINGS);

// Animation Config
export const NAVIGATION_ANIMATION = process.env.NAVIGATION_ANIMATION;
export const ANIMATION_FADE = parseFloat(process.env.ANIMATION_FADE);
export const ANIMATION_STEPS = process.env.ANIMATION_STEPS;
export const ANIMATION_SKIP = process.env.ANIMATION_SKIP;
