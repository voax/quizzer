import produce from 'immer';

import { wsConnect } from '../websocket';
import { setLoaderAction, stopLoaderAction } from '../loader';
import { showPopUpAction } from '../pop-up';
import { checkFetchError, fetchApi, fetchApiSendJson } from '../../utils';

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

export const fetchRoomState = roomCode => async dispatch => {
  try {
    dispatch(setLoaderAction('Fetching room information...'));

    const response = await fetchApi(`rooms/${roomCode}`);
    const room = await checkFetchError(response);

    dispatch({ type: 'FETCHED_ROOM_INFO', room });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const closeRoomQuestion = roomCode => async dispatch => {
  try {
    dispatch(setLoaderAction('Closing room question...'));

    const response = await fetchApiSendJson(`rooms/${roomCode}`, 'PATCH', {
      questionClosed: true,
    });
    await checkFetchError(response);

    dispatch({ type: 'ROOM_QUESTION_CLOSE' });
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
    case 'FETCHED_ROOM_INFO':
      draft.round = action.room.round;
      draft.currentQuestion = action.room.currentQuestion;
      draft.round = action.room.round;
      draft.questionClosed = action.room.questionClosed;
      // category(pin):"Geography"
      // question(pin):"Name the river that flows through the city of Albuquerque in the USA."
      draft.approvedTeamApplications = action.room.teams;
      return;
    case 'ROOM_QUESTION_CLOSE':
      draft.questionClosed = true;
    default:
      return;
  }
});
