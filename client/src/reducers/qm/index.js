import reduceReducers from 'reduce-reducers';

import room from './room';
import team from './team';
import category from './category';
import question from './question';
import guess from './guess';

export default reduceReducers(
  {
    roomCode: null,
    language: null,

    selectedTeamApplication: null,
    teamApplications: [],
    approvedTeamApplications: [],
    roomClosed: false,

    round: 0,
    roundStarted: false,
    selectedCategory: null,
    categories: [],
    selectedCategories: [],

    question: 0,
    questions: [],
    questionsAsked: [],
    currentQuestion: null,
    questionClosed: true,
    selectedQuestion: null,

    approvingATeamGuess: false,
  },
  room,
  team,
  category,
  question,
  guess
);
