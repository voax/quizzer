const mongoose = require('mongoose');
const { MAX_QUESTIONS_PER_ROUND } = process.env;

const QuestionSchema = mongoose.model('Question').schema;
const Team = mongoose.model('Team');
const TeamSchema = Team.schema;

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
  teams: [TeamSchema],
  applications: [TeamSchema],
  categories: [String],
  askedQuestions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  currentQuestion: QuestionSchema,
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

Room.methods.calculateRP = async function() {
  this.teams.sort((a, b) => b.roundScore - a.roundScore);

  let position = 1;
  let incrementPosition = 0;
  let previousRoundScore = null;

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

    await Team.findByIdAndUpdate(team._id, {
      roundScore: team.roundScore,
      roundPoints: team.roundPoints,
    });
  }

  this.teams.sort((a, b) => b.roundPoints - a.roundPoints);
};

Room.methods.nextRound = async function() {
  this.roundStarted = false;
  this.questionNo = 0;
  await this.calculateRP();
};

Room.methods.nextQuestion = async function() {
  for (const team of this.teams) {
    if (team.guessCorrect) {
      team.roundScore++;
      await Team.findByIdAndUpdate(team._id, { roundScore: team.roundScore });
    }
  }

  this.currentQuestion = null;

  if (this.questionNo >= MAX_QUESTIONS_PER_ROUND) {
    await this.nextRound();
  }
};

mongoose.model('Room', Room);
