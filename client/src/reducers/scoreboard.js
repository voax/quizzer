import produce from 'immer';

export const scoreboardIncrementAction = (team, score = 1) => {
  return {
    type: 'INCREMENT',
    team,
    score,
  };
};

export const scoreboardDecrementAction = (team, score = 1) => {
  return {
    type: 'DECREMENT',
    team,
    score: -score,
  };
};

const scoreboardReducer = produce(
  (draft, action) => {
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
  },
  [
    {
      team: 'team 1',
      score: 0,
    },
    {
      team: 'team 2',
      score: 500,
    },
  ]
);

export default scoreboardReducer;
