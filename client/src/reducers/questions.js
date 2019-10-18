import produce from 'immer';

const API_URL = 'http://localhost:4000';

export const fetchQuestionsAction = () => async dispatch => {
  dispatch({ type: 'REQUEST_FETCH' });

  const response = await fetch(`${API_URL}/questions`, {
    method: 'get',
    headers: {
      'Accept-Language': 'nl',
    },
  });
  const payload = await response.json();

  dispatch({ type: 'FETCHED_QUESTIONS', payload });
};

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
