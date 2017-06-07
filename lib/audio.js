import playsound from 'play-sound';
import {AUDIO_PATH} from "./constants";

const player = playsound(({player: "mpg123"}));

let audio;

export function play(filename){
  stop();
  audio = player.play(AUDIO_PATH + filename, function(err){
    if (err && !err.killed) {
      console.error("Audio failed to play! (probably no audio device available)");
    }
  });
}

export function stop() {
  if(audio) {
    audio.kill();
    audio = undefined;
  }
}
