const mongoose = require('mongoose');

const Team = new mongoose.Schema({
  sessionID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  roundPoints: {
    type: Number,
    default: 0,
  },
  roundScore: {
    type: Number,
    default: 0,
  },
  guess: {
    type: String,
  },
  guessCorrect: {
    type: Boolean,
  },
});

mongoose.model('Team', Team);
