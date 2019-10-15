export const textInputHandler = (name, value) => {
  return {
    type: 'TEXT_INPUT_HANDLER',
    name,
    value,
  };
};
