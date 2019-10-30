import produce from 'immer';

import { fetchApi, checkFetchError } from '../utils';
import { showPopUpAction } from './pop-up';
import { setLoaderAction, stopLoaderAction } from './loader';

export const loginAsScoreboardViewer = roomCode => async dispatch => {
  try {
    dispatch({ type: 'STARTED_CONNECTING_TO_ROOM' });
    dispatch(setLoaderAction('Connecting to room...'));

    const response = await fetchApi(`rooms/${roomCode}/scoreboards`, 'POST');
    const { message } = await checkFetchError(response);
    dispatch(setLoaderAction(message));

    dispatch({ type: 'ACCESS_CONFIRMED', roomCode });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch({ type: 'TRIED_CONNECTING_TO_ROOM' });
    dispatch({ type: 'STOPPED_CONNECTING_TO_ROOM' });
    dispatch(stopLoaderAction());
  }
};

export default produce(
  (draft, action) => {
    switch (action.type) {
      case 'ACCESS_CONFIRMED':
        draft.roomCode = action.roomCode;
        draft.connectedToRoom = true;
        return;
      case 'TRIED_CONNECTING_TO_ROOM':
        draft.triedConnectingToRoom = true;
        return;
      case 'STARTED_CONNECTING_TO_ROOM':
        draft.connectingToRoom = true;
        return;
      case 'STOPPED_CONNECTING_TO_ROOM':
        draft.connectingToRoom = false;
        return;
      default:
        return;
    }
  },
  {
    roomCode: null,
    triedConnectingToRoom: false,
    connectingToRoom: false,
    connectedToRoom: false,
  }
);
