const API_URL = 'http://localhost:4000';

export const fetchQuestions = () => async dispatch => {
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
