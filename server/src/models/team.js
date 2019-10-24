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
    type: String,
  },
  roundScore: {
    type: Number,
  },
  guess: {
    type: String,
  },
  guessCorrect: {
    type: Boolean,
  },
});

mongoose.model('Team', Team);
