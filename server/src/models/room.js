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
  language: {
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
  questionCompleted: {
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
  try {
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

      position++;

      await Team.findByIdAndUpdate(team._id, {
        roundPoints: team.roundPoints,
      });
    }

    this.teams.sort((a, b) => b.roundPoints - a.roundPoints);
  } catch (error) {
    return Promise.reject(error);
  }
};

Room.methods.nextRound = async function() {
  try {
    this.roundStarted = false;
    await this.calculateRP();
  } catch (error) {
    return Promise.reject(error);
  }
};

Room.methods.nextQuestion = async function() {
  try {
    for (const team of this.teams) {
      if (team.guessCorrect) {
        team.roundScore++;
        await Team.findByIdAndUpdate(team._id, { roundScore: team.roundScore });
      }
    }

    this.currentQuestion = null;
    this.questionCompleted = true;

    if (this.questionNo >= MAX_QUESTIONS_PER_ROUND) {
      await this.nextRound();
    }

    this.pingScoreboards('SCOREBOARD_REFRESH');
  } catch (error) {
    return Promise.reject(error);
  }
};

Room.methods.startRound = async function(categories) {
  try {
    if (this.roundStarted) {
      return Promise.reject({ statusCode: 400, message: 'Round has already been started.' });
    }

    if (categories.length !== 3) {
      return Promise.reject({ statusCode: 400, message: 'Invalid amount of categories selected.' });
    }

    for (const team of this.teams) {
      team.roundScore = 0;

      await Team.findByIdAndUpdate(team._id, {
        roundScore: team.roundScore,
      });
    }

    this.round++;
    this.questionNo = 0;
    this.categories = categories;
    this.roundStarted = true;

    await this.save();

    this.pingTeams('CATEGORIES_SELECTED');

    return { roundStarted: this.roundStarted, round: this.round, questionNo: this.questionNo };
  } catch (error) {
    return Promise.reject(error);
  }
};

Room.methods.startQuestion = async function(question) {
  try {
    if (!this.questionClosed) {
      return Promise.reject({ statusCode: 400, message: 'Question is already ongoing.' });
    }

    if (this.askedQuestions.includes(question._id)) {
      return Promise.reject({
        statusCode: 400,
        message: 'The selected question has already been asked.',
      });
    }

    for (const team of this.teams) {
      team.guess = '';
      team.guessCorrect = false;

      await Team.findByIdAndUpdate(team._id, { guess: '', guessCorrect: false });
    }

    this.questionCompleted = false;
    this.questionClosed = false;
    this.questionNo++;
    this.currentQuestion = question;
    this.askedQuestions.push(question._id);

    await this.save();

    this.pingTeams('QUESTION_SELECTED');
    this.pingScoreboards('SCOREBOARD_REFRESH');

    return { questionClosed: this.questionClosed, questionNo: this.questionNo };
  } catch (error) {
    return Promise.reject(error);
  }
};

mongoose.model('Room', Room);
