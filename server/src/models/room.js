const mongoose = require('mongoose');
const { MAX_QUESTIONS_PER_ROUND } = process.env;

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

Room.methods.calculateRP = function() {
  this.teams.sort((a, b) => b.roundScore - a.roundScore);

  let position = 1;
  let incrementPosition = 0;
  let previousRoundScore = 0;

  for (const team of this.teams) {
    if (previousRoundScore === team.roundScore) {
      incrementPosition++;
    } else {
      incrementPosition = 0;
    }

    switch (position - incrementPosition) {
      case 1:
        team.roundPoints += 4;
        break;
      case 2:
        team.roundPoints += 2;
        break;
      case 3:
        team.roundPoints += 1;
        break;
      default:
        team.roundPoints += 0.1;
        break;
    }

    previousRoundScore = team.roundScore;
    team.roundScore = 0;

    position++;
  }

  this.teams.sort((a, b) => b.roundPoints - a.roundPoints);
};

Room.methods.nextRound = function() {
  this.roundStarted = false;
  this.questionNo = 0;
  this.calculateRP();
};

Room.methods.nextQuestion = function() {
  for (const team of this.teams) {
    if (team.guessCorrect) {
      team.roundScore++;
    }
  }

  this.currentQuestion = null;

  if (this.questionNo >= MAX_QUESTIONS_PER_ROUND) {
    this.nextRound();
  }
};

mongoose.model('Room', Room);
