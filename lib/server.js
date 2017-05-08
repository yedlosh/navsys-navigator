import express from 'express';
import bodyParser from 'body-parser';
import * as config from "./config";
import * as routes from "./routes";
import * as strand from "./strand";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', async (req, res, next) => {
  res.json({msg: "Hello World"});
  next();
});
app.post('/navigate',routes.navigate);
app.post('/stop',routes.stop);
app.post('/show',routes.show);

app.listen(config.PORT, config.HOST, () => {
  console.log(`Navigator server runs on port: ${config.PORT}!`);
});

// Clear LED strand
process.on('SIGINT', function () {
  strand.reset();
  process.nextTick(function () { process.exit(0); });
});
