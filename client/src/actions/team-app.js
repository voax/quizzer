export const showValidation = () => {
  return {
    type: 'SHOW_VALIDATION',
  };
};

export const hideValidation = () => {
  return {
    type: 'HIDE_VALIDATION',
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
