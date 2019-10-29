import reduceReducers from 'reduce-reducers';

import room from './room';
import team from './team';
import category from './category';
import question from './question';
import guess from './guess';

export default reduceReducers(
  {
    roomCode: null,

    round: 0,
    question: 0,
    questionClosed: false,

    selectedTeamApplication: null,
    teamApplications: [],
    approvedTeamApplications: [],
    teamsConfirmed: false,

    selectedCategory: null,
    categories: [],
    selectedCategories: [],
    categoriesConfirmed: false,

    questions: [],
    questionsAsked: [],
    currentQuestion: null,
    selectedQuestion: null,

    approvingATeamGuess: false,
  },
  room,
  team,
  category,
  question,
  guess
);
