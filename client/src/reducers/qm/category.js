import produce from 'immer';

import { setLoaderAction, stopLoaderAction } from '../loader';
import { showPopUpAction } from '../pop-up';
import { checkFetchError, fetchApi, fetchApiSendJson } from '../../utils';

export const fetchCategories = () => async dispatch => {
  try {
    dispatch(setLoaderAction('Retrieving categories...'));
    const response = await fetchApi(`categories`);
    const categories = await checkFetchError(response);
    dispatch({ type: 'CATEGORIES_FETCHED', categories });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const selectCategory = () => ({
  type: 'APPROVE_SELECTED_CATEGORY',
});

export const deselectCategory = () => ({
  type: 'REMOVE_SELECTED_CATEGORY',
});

export const confirmCategoriesAndContinue = (roomCode, selectedCategories) => async dispatch => {
  try {
    dispatch(setLoaderAction('Loading...'));

    const response = await fetchApiSendJson(`rooms/${roomCode}/categories`, 'PUT', {
      categories: selectedCategories.map(({ category }) => category),
    });
    const { roundStarted, round, questionNo } = await checkFetchError(response);

    dispatch({ type: 'CONFIRM_CATEGORIES_SELECTED', roundStarted, round, questionNo });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export default produce((draft, action) => {
  switch (action.type) {
    case 'CATEGORIES_FETCHED':
      draft.categories = action.categories.map(category => ({
        id: category,
        category,
      }));
      return;
    case 'ITEM_LIST_CHANGED_CATEGORIES':
      draft.selectedCategory = action.value;
      return;
    case 'APPROVE_SELECTED_CATEGORY':
      if (draft.selectedCategories.length >= 3) {
        return;
      }
      draft.selectedCategories.push(draft.selectedCategory);
      draft.categories = draft.categories.filter(({ id }) => id !== draft.selectedCategory.id);
      draft.selectedCategory = null;
      return;
    case 'REMOVE_SELECTED_CATEGORY':
      draft.selectedCategories = draft.selectedCategories.filter(
        ({ id }) => id !== draft.selectedCategory.id
      );
      draft.categories.push(draft.selectedCategory);
      draft.selectedCategory = null;
      return;
    case 'CONFIRM_CATEGORIES_SELECTED':
      draft.roundStarted = action.roundStarted;
      draft.round = action.round;
      draft.question = action.questionNo;
      return;
    default:
      return;
  }
});
