const mongoose = require('mongoose');

const Question = mongoose.model('Question').schema;
const Team = mongoose.model('Team').schema;

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
    default: 1,
  },
  questionNo: {
    type: Number,
    default: 1,
  },
  roundStarted: {
    type: Boolean,
    default: false,
  },
  teams: [Team],
  applications: [Team],
  askedQuestions: [Question],
  currentQuestion: Question,
  questionClosed: {
    type: Boolean,
    default: false,
  },
  roomClosed: {
    type: Boolean,
    default: false,
  },
  ended: {
    type: Boolean,
    default: false,
  },
});

mongoose.model('Room', Room);
