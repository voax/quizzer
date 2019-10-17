export const showPopUp = (title, message, button = 'OK') => {
  return {
    type: 'SHOW_POP_UP',
    title,
    message,
    button,
  };
};

export const hidePopUp = () => {
  return {
    type: 'HIDE_POP_UP',
  };
};

export const textInputHandler = (name, value, minLength, maxLength) => {
  return {
    type: 'TEXT_INPUT_HANDLER',
    name,
    value,
    minLength,
    maxLength,
  };
};
