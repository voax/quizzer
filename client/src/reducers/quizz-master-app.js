import produce from 'immer';

import { wsConnect } from './socket';
import { showPopUpAction } from './pop-up';

export const createQuizzRoom = () => (dispatch, getState) => {
  dispatch(wsConnect());

  const {
    socket: { client },
    quizzMasterApp: { room },
  } = getState();

  if (room) {
    dispatch(showPopUpAction('Error', 'Room already created!'));
    return;
  }

  dispatch({ type: 'CREATING_ROOM' });
  return client
    .create('quiz')
    .then(
      room => {
        dispatch({ type: 'CREATE_QUIZZ_ROOM', room });
      },
      e => {
        // @FIX : Better feedback to user instead of error message
        dispatch(showPopUpAction(`Error ${e.code}`, e.message));
      }
    )
    .finally(() => {
      setTimeout(() => {
        dispatch({ type: 'CREATED_ROOM' });
      }, 500);
    });
};

const quizzMasterApp = produce(
  (draft, action) => {
    switch (action.type) {
      case 'CREATE_QUIZZ_ROOM':
        if (draft.room) {
          return;
        }
        draft.room = action.room;
        return;
      case 'CREATING_ROOM':
        draft.isCreating = true;
        return;
      case 'CREATED_ROOM':
        draft.isCreating = false;
        return;
      default:
        return;
    }
  },
  {
    room: null,
    isCreating: false,
  }
);

export default quizzMasterApp;
