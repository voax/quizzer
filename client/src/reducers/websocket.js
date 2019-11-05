import produce from 'immer';

// actions are handled by socketMiddleware
export const wsConnect = (ping = false) => ({ type: 'WS_CONNECT', ping });
export const wsDisconnect = () => ({ type: 'WS_DISCONNECT' });
export const wsPing = command => ({ type: 'WS_PING', command });
// end of socketMiddleware actions

export const wsConnected = () => ({ type: 'WS_CONNECTED' });
export const wsDisconnected = () => ({ type: 'WS_DISCONNECTED' });
export const wsConnecting = () => ({ type: 'WS_CONNECTING' });
export const wsCrash = () => ({ type: 'WS_CRASH' });

const websocketReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case 'WS_CONNECTED':
        draft.connected = true;
        draft.connecting = false;
        draft.crashed = false;
        return;
      case 'WS_DISCONNECTED':
        draft.connected = false;
        draft.connecting = false;
        return;
      case 'WS_CONNECTING':
        draft.connecting = true;
        return;
      case 'WS_CRASH':
        draft.crashed = true;
        draft.connecting = false;
        return;
      default:
        return;
    }
  },
  {
    connected: false,
    connecting: false,
    crashed: false,
  }
);

export default websocketReducer;
