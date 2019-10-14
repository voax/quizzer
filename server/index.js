require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const { EXPRESS_PORT, MONGODB_HOST, MONGODB_PORT, DB_NAME } = process.env;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.listen(EXPRESS_PORT, () => {
  console.log(`Server is running on Port: ${EXPRESS_PORT}`);
});
