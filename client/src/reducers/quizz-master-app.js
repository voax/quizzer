import produce from 'immer';
import { setLoaderAction, stopLoaderAction } from './loader';
import { showPopUpAction } from './pop-up';
import { wsConnect } from './websocket';

const API_URL = 'http://localhost:4000';

const checkFetchError = async response => {
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  return Promise.reject(new Error(json.message));
};

export const setRoomCode = roomCode => ({ type: 'SET_ROOM_CODE', roomCode });
export const clearRoomCode = () => ({ type: 'SET_ROOM_CODE' });

export const createRoom = () => async dispatch => {
  try {
    dispatch(setLoaderAction('Creating a room...'));

    const response = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'include',
      mode: 'cors',
    });
    const { roomCode } = await checkFetchError(response);

    dispatch(wsConnect());
    dispatch(setRoomCode(roomCode));
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const addTeamApplications = applications => ({
  type: 'ADD_TEAM_APPLICATIONS',
  applications,
});

export const fetchTeamApplications = roomCode => async dispatch => {
  try {
    const response = await fetch(`${API_URL}/rooms/${roomCode}/applications`, {
      method: 'GET',
      cache: 'default',
      credentials: 'include',
      mode: 'cors',
    });
    const data = await checkFetchError(response);

    dispatch(addTeamApplications(JSON.parse(data)));
  } catch (error) {
    console.error(error.message);
  }
};

export const handleItemListChange = (name, value) => ({
  type: `ITEM_LIST_CHANGED_${name}`,
  value,
});

const approveTeamApplication = selectedTeamApplication => ({
  type: `APPROVE_TEAM_APPLICATION`,
  selectedTeamApplication,
});

export const approveSelectedApplication = (selectedTeamApplication, roomCode) => async dispatch => {
  try {
    const bodyObject = { applicationID: selectedTeamApplication.id };

    const response = await fetch(`${API_URL}/rooms/${roomCode}/teams`, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyObject),
    });
    await checkFetchError(response);

    dispatch(approveTeamApplication(selectedTeamApplication));
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  }
};

export const rejectTeamApplication = selectedTeamApplication => ({
  type: `REJECT_TEAM_APPLICATION`,
  selectedTeamApplication,
});

export const rejectSelectedApplication = (selectedTeamApplication, roomCode) => async dispatch => {
  try {
    const response = await fetch(
      `${API_URL}/rooms/${roomCode}/applications/${selectedTeamApplication.id}`,
      {
        method: 'DELETE',
        cache: 'no-cache',
        credentials: 'include',
        mode: 'cors',
      }
    );
    await checkFetchError(response);

    dispatch(rejectTeamApplication(selectedTeamApplication));
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  }
};

export const confirmTeamsAndContinue = roomCode => async dispatch => {
  try {
    dispatch(setLoaderAction('Loading...'));
    const bodyObject = { roomClosed: true, applications: [], round: 1 };
    const response = await fetch(`${API_URL}/rooms/${roomCode}`, {
      method: 'PATCH',
      cache: 'no-cache',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyObject),
    });
    await checkFetchError(response);

    dispatch({ type: 'CONFIRM_TEAMS_APPROVED' });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const fetchCategories = () => async dispatch => {
  try {
    dispatch(setLoaderAction('Retrieving categories...'));
    const response = await fetch(`${API_URL}/categories`, {
      method: 'GET',
      cache: 'default',
      headers: {
        'Accept-Language': 'en',
      },
      mode: 'cors',
      credentials: 'include',
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

export const confirmCategoriesAndContinue = () => ({
  type: 'CONFIRM_CATEGORIES_SELECTED',
});

const quizzMasterApp = produce(
  (draft, action) => {
    switch (action.type) {
      case 'SET_ROOM_CODE':
        draft.roomCode = action.roomCode;
        return;
      case 'CLEAR_ROOM_CODE':
        draft.roomCode = null;
        return;
      case 'ITEM_LIST_CHANGED_APPLIED':
        draft.selectedTeamApplication = action.value;
        return;
      case 'ADD_TEAM_APPLICATIONS':
        draft.teamApplications = action.applications;
        return;
      case 'APPROVE_TEAM_APPLICATION':
        draft.teamApplications = draft.teamApplications.filter(team => {
          return team.id !== action.selectedTeamApplication.id;
        });
        draft.approvedTeamApplications.push(action.selectedTeamApplication);
        draft.selectedTeamApplication = null;
        return;
      case 'REJECT_TEAM_APPLICATION':
        draft.teamApplications = draft.teamApplications.filter(team => {
          return team.id !== action.selectedTeamApplication.id;
        });
        draft.selectedTeamApplication = null;
        return;
      case 'CONFIRM_TEAMS_APPROVED':
        draft.teamsConfirmed = true;
        draft.round = 1;
        draft.teamApplications = [];
        return;
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
        draft.selectedCategories.push(draft.selectedCategory);
        draft.categories = draft.categories.filter(({ id }) => id !== draft.selectedCategory.id);
        draft.selectedCategory = null;
        return;
      case 'CONFIRM_CATEGORIES_SELECTED':
        draft.categoriesConfirmed = true;
        return;
      default:
        return;
    }
  },
  {
    roomCode: null,

    selectedTeamApplication: null,
    teamApplications: [],
    approvedTeamApplications: [],
    teamsConfirmed: false,

    selectedCategory: null,
    categories: [],
    selectedCategories: [],
    categoriesConfirmed: false,

    questions: [],
    questionsAsked: [],

    currentQuestion: null,
    round: 0,
    question: 0,
  }
);

export default quizzMasterApp;
