import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { wsConnect } from '../reducers/websocket';
import Button from './Button';

const RecoverButton = () => {
  const connecting = useSelector(state => state.websocket.connecting);
  const dispatch = useDispatch();

  return (
    <Button type="secondary recover" onClick={() => dispatch(wsConnect())} disabled={connecting}>
      <span role="img" aria-label="recover_connection">
        ♻️
      </span>
    </Button>
  );
};

export default RecoverButton;
