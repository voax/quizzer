import produce from 'immer';

import { fetchApi } from '.././utils';

export const fetchQuestionsAction = () => async dispatch => {
  dispatch({ type: 'REQUEST_FETCH' });

  const response = await fetchApi('questions', 'GET', {
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
