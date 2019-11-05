import { wsConnected, wsDisconnected, wsPing, wsCrash, wsConnecting } from '../reducers/websocket';
import { showPopUpAction } from '../reducers/pop-up';
import { setLoaderAction, stopLoaderAction } from '../reducers/loader';
import { fetchTeamApplications } from '../reducers/qm/team';
import { fetchRoomState } from '../reducers/qm/room';
import { fetchRoom, clearTeamHome, clearTeamRoom, closeQuestion } from '../reducers/team-app';
import { fetchGameState, quizzEnded } from '../reducers/scoreboard';

const socketMiddleware = () => {
  let socket = null;

  const onOpen = (store, ping) => () => {
    store.dispatch(wsConnected());
    if (ping) {
      store.dispatch(wsPing(ping));
    }
  };

  const onClose = store => ({ code }) => {
    store.dispatch(wsDisconnected());
    if (code === 1006) {
      store.dispatch(wsCrash());
      store.dispatch(showPopUpAction('💥', 'Server offline.'));
    }
  };

  const onMessage = store => ({ data }) => {
    const state = store.getState();
    switch (data) {
      case 'TEAM_APPLIED':
        store.dispatch(fetchTeamApplications(state.quizzMasterApp.roomCode));
        break;
      case 'APPLICATION_ACCEPTED':
        store.dispatch(
          setLoaderAction(
            'Your team has been approved. Waiting for the Quizz Master to start the round...'
          )
        );
        break;
      case 'APPLICATION_REJECTED':
        store.dispatch(stopLoaderAction());
        store.dispatch(showPopUpAction('😔', 'Your application has been rejected.'));
        socket.close();
        break;
      case 'CATEGORIES_SELECTED':
        store.dispatch(
          setLoaderAction('Round started. Waiting for the Quizz Master to select a question...')
        );
        break;
      case 'QUESTION_SELECTED':
        store.dispatch(fetchRoom(state.teamApp.roomCode.value));
        break;
      case 'GUESS_SUBMITTED':
        store.dispatch(fetchRoomState(state.quizzMasterApp.roomCode));
        break;
      case 'ROOM_CLOSED':
        store.dispatch(clearTeamHome());
        store.dispatch(clearTeamRoom());
        store.dispatch(stopLoaderAction());
        store.dispatch(showPopUpAction('💔', 'Room has been closed.'));
        socket.close();
        break;
      case 'QUESTION_CLOSED':
        store.dispatch(closeQuestion(state.teamApp.roomCode.value));
        break;
      case 'SCOREBOARD_REFRESH':
        store.dispatch(fetchGameState(state.scoreboard.roomCode));
        break;
      case 'SCOREBOARD_QUIZZ_ENDED':
        store.dispatch(quizzEnded());
        break;
      default:
        console.warn(`Not implemented: type "${data}".`);
        break;
    }
  };

  // the middleware part of this function
  return store => next => action => {
    switch (action.type) {
      case 'WS_CONNECT':
        store.dispatch(wsConnecting());
        if (socket !== null) {
          socket.close();
        }
        socket = new WebSocket(process.env.REACT_APP_WS_URL);
        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        socket.onopen = onOpen(store, action.ping);
        break;
      case 'WS_DISCONNECT':
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        console.log('websocket closed');
        break;
      case 'WS_PING':
        socket.send(JSON.stringify({ command: action.command }));
        break;
      default:
        return next(action);
    }
  };
};

export default socketMiddleware();
