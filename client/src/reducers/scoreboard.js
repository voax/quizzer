import produce from 'immer';

import { fetchApi, checkFetchError } from '../utils';
import { showPopUpAction } from './pop-up';
import { setLoaderAction, stopLoaderAction } from './loader';
import { wsConnect } from './websocket';

export const loginAsScoreboardViewer = roomCode => async dispatch => {
  try {
    dispatch({ type: 'STARTED_CONNECTING_TO_ROOM' });
    dispatch(setLoaderAction('Connecting to room...'));

    const response = await fetchApi(`rooms/${roomCode}/scoreboards`, 'POST');
    const { message } = await checkFetchError(response);

    dispatch(wsConnect());
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

export const fetchGameState = roomCode => async dispatch => {
  try {
    const response = await fetchApi(`rooms/${roomCode}`);
    const data = await checkFetchError(response);
    dispatch({ type: 'FETCHED_SCOREBOARD_ROOM_STATE', data });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  }
};

export const quizzEnded = () => ({ type: 'QUIZZ_ENDED' });

export default produce(
  (draft, action) => {
    switch (action.type) {
      case 'FETCHED_SCOREBOARD_ROOM_STATE':
        draft.round = action.data.round;
        draft.questionNo = action.data.questionNo;
        draft.questionClosed = action.data.questionClosed;
        draft.currentQuestion = action.data.currentQuestion || draft.currentQuestion;
        draft.teams = action.data.teams;
        draft.questionCompleted = action.data.questionCompleted;
        return;
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
      case 'QUIZZ_ENDED':
        draft.ended = true;
        return;
      default:
        return;
    }
  },
  {
    ended: false,
    roomCode: null,
    connectedToRoom: false,
    connectingToRoom: false,
    triedConnectingToRoom: false,

    round: null,
    teams: null,
    currentQuestion: {},
    questionNo: null,
    questionClosed: null,
  }
);
