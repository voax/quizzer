import produce from 'immer';

export const setLoaderAction = text => {
  return {
    type: 'SET_LOADER',
    text,
  };
};

export const stopLoaderAction = () => {
  return {
    type: 'STOP_LOADER',
  };
};

const loaderReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case 'SET_LOADER':
        draft.active = true;
        draft.text = action.text;
        return;
      case 'STOP_LOADER':
        draft.active = false;
        draft.text = '';
        return;
      default:
        return;
    }
  },
  {
    active: false,
    text: '',
  }
);

export default loaderReducer;
