import produce from 'immer';

const questionsReducer = produce((draft, action) => {
  switch (action.type) {
    case 'FETCH_QUESTIONS':
      draft.push(action.payload);
      return;
    default:
      return;
  }
}, []);

export default questionsReducer;
