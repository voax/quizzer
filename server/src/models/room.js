const mongoose = require('mongoose');

const Question = mongoose.model('Question').schema;
const Team = mongoose.model('Team').schema;

const sockets = require('../wss-clients');

const Room = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  host: {
    type: String,
    required: true,
  },
  round: {
    type: Number,
    default: 0,
  },
  questionNo: {
    type: Number,
    default: 0,
  },
  roundStarted: {
    type: Boolean,
    default: false,
  },
  teams: [Team],
  applications: [Team],
  categories: [String],
  askedQuestions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  currentQuestion: Question,
  questionClosed: {
    type: Boolean,
    default: true,
  },
  roomClosed: {
    type: Boolean,
    default: false,
  },
  scoreboards: [String],
  ended: {
    type: Boolean,
    default: false,
  },
});

Room.methods.pingTeams = function(msg) {
  for (const { sessionID: id } of this.teams) {
    if (sockets.has(id)) {
      sockets.get(id).send(msg);
    }
  }
};

Room.methods.pingScoreboards = function(msg) {
  for (const id of this.scoreboards) {
    if (sockets.has(id)) {
      sockets.get(id).send(msg);
    }
  }
};

Room.methods.pingApplications = function(msg) {
  for (const { sessionID: id } of this.applications) {
    if (sockets.has(id)) {
      sockets.get(id).send(msg);
    }
  }
};

Room.methods.pingHost = function(msg) {
  if (sockets.has(this.host)) {
    sockets.get(this.host).send(msg);
  }
};

mongoose.model('Room', Room);
