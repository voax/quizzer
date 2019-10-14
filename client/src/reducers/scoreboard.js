import produce from 'immer';

const scoreboardReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case 'FETCH_SCORE':
        draft.score = action.score;
        return;
      default:
        return;
    }
  },
  { score: 0 }
);

export default scoreboardReducer;
