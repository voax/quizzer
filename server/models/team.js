const mongoose = require('mongoose');

const Team = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

mongoose.model('Team', Team);
