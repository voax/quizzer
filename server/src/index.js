require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const http = require('http');

const simpleErrorHandler = require('./middleware/error-handler');
const useAcceptLanguage = require('./middleware/accept-language');

const { EXPRESS_PORT, EXPRESS_SECRET, MONGODB_HOST, MONGODB_PORT, DB_NAME } = process.env;

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    saveUninitialized: false, // Don't create session until something stored
    resave: false, // Don't save session if unmodified
    secret: EXPRESS_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);
app.use(useAcceptLanguage());

require('./models');
require('./routes')(app);

app.use(
  simpleErrorHandler({
    defaultStatusCode: 500,
    defaultMessage: 'Something went wrong...',
  })
);

mongoose.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

httpServer.listen(EXPRESS_PORT, () => {
  console.log(`Server is running on Port: ${EXPRESS_PORT}`);
});
