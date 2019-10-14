require('dotenv').config();
const mongoose = require('mongoose');

require('../model/question');

const { MONGODB_HOST, MONGODB_PORT, DB_NAME } = process.env;
const seedQuestion = require('./question');

mongoose
  .connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    return Promise.all([seedQuestion()]);
  })
  .catch(error => {
    console.error(error);
  })
  .then(() => {
    return mongoose.connection.close();
  });
