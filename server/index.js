require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const simpleErrorHandler = require('./middleware/error-handler');
const useAcceptLanguage = require('./middleware/accept-language');

const { EXPRESS_PORT, MONGODB_HOST, MONGODB_PORT, DB_NAME } = process.env;
const app = express();

app.use(cors());
app.use(bodyParser.json());
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

app.listen(EXPRESS_PORT, () => {
  console.log(`Server is running on Port: ${EXPRESS_PORT}`);
});
