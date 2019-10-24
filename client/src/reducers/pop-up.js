import produce from 'immer';

export const showPopUpAction = (title, message, button = 'OK') => {
  return {
    type: 'SHOW_POP_UP',
    title,
    message,
    button,
  };
};

export const hidePopUpAction = () => {
  return {
    type: 'HIDE_POP_UP',
  };
};

const popUpReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case 'SHOW_POP_UP':
        draft.title = action.title;
        draft.message = action.message;
        draft.button = action.button;
        draft.active = true;
        return;
      case 'HIDE_POP_UP':
        draft.active = false;
        return;
      default:
        return;
    }
  },
  {
    title: '',
    message: '',
    button: '',
    active: false,
  }
);

export default popUpReducer;
