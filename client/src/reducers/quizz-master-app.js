import produce from 'immer';
import { setLoaderAction, stopLoaderAction } from './loader';
import { showPopUpAction } from './pop-up';
import { wsConnect } from './websocket';

const API_URL = 'http://localhost:4000/';

const checkFetchError = async response => {
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  return Promise.reject(new Error(json.message));
};

export const setRoomCode = roomCode => ({ type: 'SET_ROOM_CODE', roomCode });
export const clearRoomCode = () => ({ type: 'SET_ROOM_CODE' });

export const createRoom = () => async dispatch => {
  try {
    dispatch(setLoaderAction('Creating a room...'));

    const response = await fetch(`${API_URL}/rooms`, {
      method: 'post',
    });
    const { roomCode } = checkFetchError(response);

    dispatch(wsConnect());
    dispatch(setRoomCode(roomCode));
    dispatch(stopLoaderAction());
    // history.push('/master/teams'); // does not work.
  } catch (error) {
    dispatch(stopLoaderAction());
    dispatch(showPopUpAction('ERROR', error.message));
  }
};

const quizzMasterApp = produce(
  (draft, action) => {
    switch (action.type) {
      case 'SET_ROOM_CODE':
        draft.room = action.roomCode;
        return;
      case 'CLEAR_ROOM_CODE':
        draft.room = null;
        return;
      default:
        return;
    }
  },
  {
    roomCode: null,
  }
);

export default quizzMasterApp;
