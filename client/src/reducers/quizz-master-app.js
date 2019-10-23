import produce from 'immer';

const quizzMasterApp = produce(
  (draft, action) => {
    switch (action.type) {
      case 'CREATE_QUIZZ_ROOM':
        if (draft.room) {
          return;
        }
        draft.room = action.room;
        return;
      case 'CREATING_ROOM':
        draft.isCreating = true;
        return;
      case 'CREATED_ROOM':
        draft.isCreating = false;
        return;
      default:
        return;
    }
  },
  {
    room: null,
    isCreating: false,
  }
);

export default quizzMasterApp;
