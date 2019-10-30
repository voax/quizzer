const mongoose = require('mongoose');

const sockets = require('../wss-clients');

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

Team.methods.ping = function(msg) {
  if (sockets.has(this.sessionID)) {
    sockets.get(this.sessionID).send(msg);
  }
};

mongoose.model('Team', Team);
