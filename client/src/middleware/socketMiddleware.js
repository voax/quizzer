import { wsConnected, wsDisconnected } from '../reducers/websocket';

const WS_HOST = 'ws://localhost:4000/';

const socketMiddleware = () => {
  let socket = null;

  const onOpen = store => () => {
    store.dispatch(wsConnected());
  };

  const onClose = store => () => {
    store.dispatch(wsDisconnected());
  };

  const onMessage = store => event => {
    const payload = JSON.parse(event.data);
    console.log('receiving server message');

    switch (payload.type) {
      // case 'ROOM_CREATED':
      //   store.dispatch(wsRoomCreated());
      //   break;
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

        // connect to the remote host
        socket = new WebSocket(WS_HOST);

        // websocket handlers
        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        socket.onopen = onOpen(store);

        break;
      case 'WS_DISCONNECT':
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        console.log('websocket closed');
        break;
      // case 'NEW_MESSAGE':
      //   console.log('sending a message', action.msg);
      //   socket.send(JSON.stringify({ command: 'NEW_MESSAGE', message: action.msg }));
      //   break;
      default:
        console.log('the next action:', action);
        return next(action);
    }
  };
};

export default socketMiddleware();
