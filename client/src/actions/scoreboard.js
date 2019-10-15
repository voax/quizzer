export const scoreboardIncrement = (team, score = 1) => {
  return {
    type: 'INCREMENT',
    team,
    score,
  };
};

export const scoreboardDecrement = (team, score = 1) => {
  return {
    type: 'DECREMENT',
    team,
    score: -score,
  };
};
