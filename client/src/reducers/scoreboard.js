import produce from 'immer';

const initialState = [
  {
    team: 'team 1',
    score: 0,
  },
  {
    team: 'team 2',
    score: 500,
  },
];

const scoreboardReducer = produce((draft, action) => {
  switch (action.type) {
    case 'INCREMENT':
    case 'DECREMENT':
      const team = draft.find(({ team }) => team === action.team);
      team.score += action.score;
      if (team.score <= 0) team.score = 0;
      return;
    default:
      return;
  }
}, initialState);

export default scoreboardReducer;
