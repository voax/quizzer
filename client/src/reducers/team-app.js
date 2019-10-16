import produce from 'immer';

const initialState = {
  roomCode: { value: '', valid: false },
  team: { value: '', valid: false },
  showValidation: false,
  isLoading: false,
};

const teamAppReducer = produce((draft, action) => {
  switch (action.type) {
    case 'SHOW_VALIDATION':
      draft.showValidation = true;
      return;
    case 'HIDE_VALIDATION':
      draft.showValidation = false;
      return;
    case 'TEXT_INPUT_HANDLER':
      if (action.value.length < action.minLength || action.value.length > action.maxLength) {
        draft[action.name].valid = false;
      } else {
        draft[action.name].valid = true;
      }
      draft[action.name].value = action.value;
      return;
    case 'REQUEST':
      draft.isLoading = true;
      return;
    default:
      return;
  }
}, initialState);

export default teamAppReducer;
