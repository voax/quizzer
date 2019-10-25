import produce from 'immer';
import { setLoaderAction, stopLoaderAction } from './loader';
import { showPopUpAction } from './pop-up';
import { wsConnect } from './websocket';

const API_URL = 'http://localhost:4000';

const checkFetchError = async response => {
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  return Promise.reject(new Error(json.message));
};

export const textInputHandlerAction = (name, value, minLength, maxLength) => {
  return {
    type: 'TEXT_INPUT_HANDLER',
    name,
    value,
    minLength,
    maxLength,
  };
};

export const applyTeam = (roomCode, name) => async dispatch => {
  try {
    dispatch(setLoaderAction('Applying team'));

    const bodyObject = { name };

    const response = await fetch(`${API_URL}/rooms/${roomCode}/applications`, {
      method: 'post',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyObject),
    });
    await checkFetchError(response);

    dispatch(wsConnect('TEAM_APPLIED'));
    dispatch(stopLoaderAction());
  } catch (error) {
    dispatch(stopLoaderAction());
    dispatch(showPopUpAction('ERROR', error.message));
  }
};

const teamAppReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case 'TEXT_INPUT_HANDLER':
        if (action.value.length < action.minLength || action.value.length > action.maxLength) {
          draft[action.name].valid = false;
        } else {
          draft[action.name].valid = true;
        }
        draft[action.name].value = action.value;
        return;
      default:
        return;
    }
  },
  {
    roomCode: {
      value: '',
      valid: false,
    },
    team: {
      value: '',
      valid: false,
    },
    question: {
      open: true,
      number: 1,
      question: 'In which art gallery is the Mona Lisa kept?',
      category: 'Art and Literature',
    },
    guess: {
      value: '',
      valid: false,
    },
  }
);

export default teamAppReducer;
