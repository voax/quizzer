import produce from 'immer';

export const textInputHandlerAction = (name, value, minLength, maxLength) => {
  return {
    type: 'TEXT_INPUT_HANDLER',
    name,
    value,
    minLength,
    maxLength,
  };
};

const teamAppReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case 'TEXT_INPUT_HANDLER':
        if (action.value.length < action.minLength || action.value.length > action.maxLength) {
          draft[action.name].valid = false;
        } else {
          draft[action.name].valid = true;
        }
        draft[action.name].value = action.value;
        return;
      default:
        return;
    }
  },
  {
    roomCode: {
      value: '',
      valid: false,
    },
    team: {
      value: '',
      valid: false,
    },
    question: {
      open: true,
      number: 1,
      question: 'In which art gallery is the Mona Lisa kept?',
      category: 'Art and Literature',
    },
    guess: {
      value: '',
      valid: false,
    },
  }
);

export default teamAppReducer;
