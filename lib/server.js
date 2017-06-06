import express from 'express';
import bodyParser from 'body-parser';
import * as config from "./config";
import * as routes from "./routes";
import * as strand from "./strand";
import * as animator from "./animator";
import * as constants from "./constants";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', async (req, res, next) => {
  res.json({msg: "Hello World"});
  next();
});
app.post('/navigate',routes.navigate);
app.post('/stop/audio',routes.stopAudio);
app.post('/stop/:id',routes.stop);
app.post('/show',routes.show);
app.post('/play/:id',routes.playCue);
app.post('/play',routes.playAudio);

if(config.INIT_LED) {
  strand.init();
  if(config.SHOW_ENDINGS) {
    animator.startAnimation(constants.ENDINGS_WARNING_ANIMATION_ID, 'endings', {color: constants.ENDINGS_WARNING_COLOR});
  }
}

app.listen(config.PORT, config.HOST, () => {
  console.log(`Navigator server runs on port: ${config.PORT}!`);
});

// Clear LED strand
process.on('SIGINT', function () {
  strand.reset();
  process.nextTick(function () { process.exit(0); });
});

process.on('SIGTERM', function () {
  strand.reset();
  process.nextTick(function () { process.exit(0); });
});


