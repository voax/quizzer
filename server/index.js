require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const languageParser = require('accept-language-parser');

const { EXPRESS_PORT, MONGODB_HOST, MONGODB_PORT, DB_NAME } = process.env;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/', (req, res, next) => {
  req.language = languageParser.parse(req.header('Accept-Language'));
  next();
});

require('./models');
require('./routes')(app);

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
