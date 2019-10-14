const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = 4000;
const DATABASE_NAME = 'quizzer';

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(`mongodb://127.0.0.1:27017/${DATABASE_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
