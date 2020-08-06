require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const http = require('http');
const ws = require('ws');

require('./models');

const simpleErrorHandler = require('./middleware/error-handler');
const httpWsUpgrade = require('./middleware/http-ws-upgrade');
const { initRoomCodes } = require('./rooms/code');

const { EXPRESS_PORT, EXPRESS_SECRET, MONGODB_HOST, MONGODB_PORT, DB_NAME } = process.env;

const app = express();
const httpServer = http.createServer(app);
const wss = new ws.Server({ noServer: true });
const store = new MongoStore({
  mongooseConnection: mongoose.connection,
});
const sessionParser = session({
  saveUninitialized: false, // Don't create session until something stored
  resave: false, // Don't save session if unmodified
  secret: EXPRESS_SECRET,
  store,
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.options(
  '*',
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(sessionParser);

require('./routes')(app);

app.use(
  simpleErrorHandler({
    defaultStatusCode: 500,
    defaultMessage: 'Something went wrong...',
  })
);

httpServer.on('upgrade', httpWsUpgrade(sessionParser)(wss));
require('./wss.js')(wss);

const main = async () => {
  await mongoose.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 10000,
  });
  await initRoomCodes();
  await new Promise(resolve => {
    httpServer.listen(EXPRESS_PORT, resolve);
  });
};

main()
  .then(() => {
    console.log(`Server is running on Port: ${EXPRESS_PORT}`);
  })
  .catch(reason => {
    console.error('ERROR:', reason);
  });
