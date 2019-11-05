import React from 'react';
import { useSelector } from 'react-redux';

const Button = ({ type, disabled = false, children, ...rest }) => {
  const connecting = useSelector(state => state.websocket.connecting);

  return (
    <button className={type} disabled={disabled || connecting} {...rest}>
      {children}
    </button>
  );
};

export default Button;
