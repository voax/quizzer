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
    approvedTeamApplications: [
      { id: 1, name: 'Fake Team 1' },
      { id: 2, name: 'Fake Team 2' },
      { id: 3, name: 'Fake Team 3' },
      { id: 4, name: 'Fake Team 4' },
    ],
    teamsConfirmed: false,

    selectedCategory: null,
    categories: [],
    selectedCategories: [
      {
        id: 'Art and Literature',
        category: 'Art and Literature',
      },
      {
        id: 'Geography',
        category: 'Geography',
      },
      {
        id: 'General Knowledge',
        category: 'General Knowledge',
      },
    ],
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
