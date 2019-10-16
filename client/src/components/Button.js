import React from 'react';

const Button = ({ type, text = 'Submit', onClick }) => (
  <button className={type} onClick={onClick}>
    {text}
  </button>
);

export default Button;
