import produce from 'immer';

// actions are handled by socketMiddleware
export const wsConnect = () => ({ type: 'WS_CONNECT' });
export const wsDisconnect = () => ({ type: 'WS_DISCONNECT' });
// end of socketMiddleware actions

export const wsConnected = () => ({ type: 'WS_CONNECTED' });
export const wsDisconnected = () => ({ type: 'WS_DISCONNECTED' });

const websocketReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case 'WS_CONNECTED':
        draft.connected = true;
        return;
      case 'WS_DISCONNECTED':
        draft.connected = false;
        return;
      default:
        return;
    }
  },
  { connected: false }
);

export default websocketReducer;
