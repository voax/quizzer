import React from 'react';

const Button = ({ type, disabled = false, children, ...rest }) => (
  <button className={type} disabled={disabled} {...rest}>
    {children}
  </button>
);

export default Button;
