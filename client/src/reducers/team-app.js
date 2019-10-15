import produce from 'immer';

const initialState = {
  isLoading: true,
  roomCode: '',
  team: '',
};

const teamAppReducer = produce((draft, action) => {
  switch (action.type) {
    case 'REQUEST':
      draft.isLoading = true;
      return;
    case 'TEXT_INPUT_HANDLER':
      draft[action.name] = action.value;
      return;
    default:
      return;
  }
}, initialState);

export default teamAppReducer;
