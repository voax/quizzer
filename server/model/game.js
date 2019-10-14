const mongoose = require('mongoose');

const Question = mongoose.model('Question').schema;
const Team = mongoose.model('Team').schema;

const Game = new mongoose.Schema({
  round: {
    type: Number,
    required: true,
  },
  questionNo: {
    type: Number,
    required: true,
  },
  question: {
    type: Question,
  },
  teams: {
    type: [Team],
    required: true,
  },
});

mongoose.model('Game', Game);
