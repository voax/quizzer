import React from 'react';

const Button = ({ type, text = 'Submit', onClick, disabled = false }) => (
  <button className={type} onClick={onClick} disabled={disabled}>
    {text}
  </button>
);

export default Button;
