import produce from 'immer';

const questionsReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case 'REQUEST_FETCH':
        draft.isLoading = true;
        return;
      case 'FETCHED_QUESTIONS':
        draft.questions.push(action.payload);
        draft.isLoading = false;
        return;
      default:
        return;
    }
  },
  { isLoading: false, list: [] }
);

export default questionsReducer;
