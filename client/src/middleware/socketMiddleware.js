import { wsConnected, wsDisconnected, wsPing } from '../reducers/websocket';
import { showPopUpAction } from '../reducers/pop-up';
import { setLoaderAction, stopLoaderAction } from '../reducers/loader';
import { fetchTeamApplications } from '../reducers/quizz-master-app';

const WS_HOST = 'ws://localhost:4000/';

const socketMiddleware = () => {
  let socket = null;

  const onOpen = (store, ping) => () => {
    store.dispatch(wsConnected());
    if (ping) {
      store.dispatch(wsPing(ping));
    }
  };

  const onClose = store => () => {
    store.dispatch(wsDisconnected());
  };

  const onMessage = store => ({ data }) => {
    switch (data) {
      case 'TEAM_APPLIED':
        const state = store.getState();
        store.dispatch(fetchTeamApplications(state.quizzMasterApp.roomCode));
        break;
      case 'APPLICATION_ACCEPTED':
        store.dispatch(
          setLoaderAction(
            'Your team is accepted. Please wait for the Quizz Master to start the Quizz.'
          )
        );
        socket.close();
        break;
      case 'APPLICATION_REJECTED':
        store.dispatch(stopLoaderAction());
        store.dispatch(showPopUpAction('💔', 'You application has been rejected.'));
        socket.close();
        break;
      case 'ROOM_CLOSED':
        store.dispatch(showPopUpAction('😔', 'Room has been closed.'));
        break;
      default:
        break;
    }
  };

  // the middleware part of this function
  return store => next => action => {
    switch (action.type) {
      case 'WS_CONNECT':
        if (socket !== null) {
          socket.close();
        }
        socket = new WebSocket(WS_HOST);
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
