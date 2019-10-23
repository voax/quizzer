import produce from 'immer';

export const wsConnect = () => ({ type: 'WS_CONNECT' });
export const wsConnected = () => ({ type: 'WS_CONNECTED' });
export const wsDisconnect = () => ({ type: 'WS_DISCONNECT' });
export const wsDisconnected = () => ({ type: 'WS_DISCONNECTED' });

const websocketReducer = produce((draft, action) => {
  switch (action.type) {
    case 'WS_CONNECTED':
      console.log('Websocket connection established.');
      return;
    default:
      return;
  }
}, {});

export default websocketReducer;
