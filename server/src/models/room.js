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
  askedQuestions: [Question],
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

mongoose.model('Room', Room);
