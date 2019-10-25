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
      method: 'post',
      credentials: 'include',
      mode: 'cors',
    });
    const { roomCode } = await checkFetchError(response);

    dispatch(wsConnect());
    dispatch(setRoomCode(roomCode));
    dispatch(stopLoaderAction());
  } catch (error) {
    dispatch(stopLoaderAction());
    dispatch(showPopUpAction('ERROR', error.message));
  }
};

export const handleItemListChange = (name, value) => ({
  type: `ITEM_LIST_CHANGED_${name}`,
  value,
});

export const approveSelectedApplication = () => ({
  type: `APPROVE_TEAM_APPLICATION`,
});

export const rejectSelectedApplication = () => ({
  type: `REJECT_TEAM_APPLICATION`,
});

export const confirmTeamsAndContinue = () => ({
  type: 'CONFIRM_TEAMS_APPROVED',
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
      case 'APPROVE_TEAM_APPLICATION':
        draft.teamApplications = draft.teamApplications.filter(team => {
          return team.id !== draft.selectedTeamApplication.id;
        });
        draft.approvedTeamApplications.push(draft.selectedTeamApplication);
        draft.selectedTeamApplication = null;
        return;
      case 'REJECT_TEAM_APPLICATION':
        draft.teamApplications = draft.teamApplications.filter(team => {
          return team.id !== draft.selectedTeamApplication.id;
        });
        draft.selectedTeamApplication = null;
        return;
      case 'CONFIRM_TEAMS_APPROVED':
        draft.teamsConfirmed = true;
        return;
      default:
        return;
    }
  },
  {
    roomCode: null,
    selectedTeamApplication: null,
    teamApplications: [
      {
        id: 1,
        name: 'Team 1',
      },
      {
        id: 2,
        name: 'Team 2',
      },
      {
        id: 3,
        name: 'Team 3',
      },
      {
        id: 4,
        name: 'Team 4',
      },
      {
        id: 5,
        name: 'Team 5',
      },
      {
        id: 6,
        name: 'Team 6',
      },
      {
        id: 7,
        name: 'Team 7',
      },
    ],
    approvedTeamApplications: [],
    teamsConfirmed: false,
  }
);

export default quizzMasterApp;
