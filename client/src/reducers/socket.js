import produce from 'immer';
import { Client } from 'colyseus.js';

const WS_URL = 'ws://localhost:4000';

export const wsConnect = () => ({ type: 'WS_CONNECT' });

const socketReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case 'WS_CONNECT':
        if (draft.webSocket) {
          return;
        }
        const client = new Client(WS_URL);
        client.joinOrCreate('quiz');
        draft.webSocket = client;
        return;
      default:
        return;
    }
  },
  {
    webSocket: null,
  }
);

export default socketReducer;
