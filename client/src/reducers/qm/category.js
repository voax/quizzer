import produce from 'immer';

import { setLoaderAction, stopLoaderAction } from '../loader';
import { showPopUpAction } from '../pop-up';
import { checkFetchError, fetchApi, fetchApiSendJson } from '../../utils';

export const fetchCategories = () => async dispatch => {
  try {
    dispatch(setLoaderAction('Retrieving categories...'));
    const response = await fetchApi(`categories`, 'GET', {
      headers: {
        'Accept-Language': 'en',
      },
    });
    const categories = await checkFetchError(response);
    dispatch({ type: 'CATEGORIES_FETCHED', categories });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const selectCategory = () => ({
  type: 'APPROVE_SELECTD_CATEGORY',
});

export const confirmCategoriesAndContinue = (roomCode, selectedCategories) => async dispatch => {
  try {
    dispatch(setLoaderAction('Loading...'));

    const response = await fetchApiSendJson(`rooms/${roomCode}/categories`, 'PUT', {
      categories: selectedCategories.map(({ category }) => category),
    });
    await checkFetchError(response);

    dispatch({ type: 'CONFIRM_CATEGORIES_SELECTED' });
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
    case 'APPROVE_SELECTD_CATEGORY':
      if (draft.selectedCategories.length >= 3) {
        return;
      }
      draft.selectedCategories.push(draft.selectedCategory);
      draft.categories = draft.categories.filter(({ id }) => id !== draft.selectedCategory.id);
      draft.selectedCategory = null;
      return;
    case 'CONFIRM_CATEGORIES_SELECTED':
      draft.question = 1;
      draft.categoriesConfirmed = true;
      return;
    default:
      return;
  }
});
