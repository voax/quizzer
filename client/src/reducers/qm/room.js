import produce from 'immer';

import { wsConnect } from '../websocket';
import { setLoaderAction, stopLoaderAction } from '../loader';
import { showPopUpAction } from '../pop-up';
import { checkFetchError, fetchApi } from '../../utils';

export const setRoomCode = roomCode => ({ type: 'SET_ROOM_CODE', roomCode });

export const clearRoomCode = () => ({ type: 'CLEAR_ROOM_CODE' });

export const createRoom = () => async dispatch => {
  try {
    dispatch(setLoaderAction('Creating a room...'));

    const response = await fetchApi(`rooms`, 'POST');
    const { roomCode } = await checkFetchError(response);

    dispatch(wsConnect());
    dispatch(setRoomCode(roomCode));
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export default produce((draft, action) => {
  switch (action.type) {
    case 'SET_ROOM_CODE':
      draft.roomCode = action.roomCode;
      return;
    case 'CLEAR_ROOM_CODE':
      draft.roomCode = null;
      return;
    default:
      return;
  }
});
