import produce from 'immer';

import { checkFetchError, fetchApi, fetchApiSendJson } from '../../utils';
import { setLoaderAction, stopLoaderAction } from '../loader';
import { showPopUpAction } from '../pop-up';

export const addTeamApplications = applications => ({
  type: 'ADD_TEAM_APPLICATIONS',
  applications,
});

export const fetchTeamApplications = roomCode => async dispatch => {
  try {
    const response = await fetchApi(`rooms/${roomCode}/applications`);
    const data = await checkFetchError(response);
    dispatch(addTeamApplications(JSON.parse(data)));
  } catch (error) {
    console.error(error);
  }
};

const approveTeamApplication = selectedTeamApplication => ({
  type: `APPROVE_TEAM_APPLICATION`,
  selectedTeamApplication,
});

export const approveSelectedApplication = (selectedTeamApplication, roomCode) => async dispatch => {
  try {
    const response = await fetchApiSendJson(`rooms/${roomCode}/teams`, 'POST', {
      applicationID: selectedTeamApplication.id,
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
    const response = await fetchApi(
      `rooms/${roomCode}/applications/${selectedTeamApplication.id}`,
      'DELETE'
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
    const response = await fetchApiSendJson(`rooms/${roomCode}`, 'PATCH', {
      roomClosed: true,
      applications: [],
    });
    const { roomClosed, applications } = await checkFetchError(response);

    dispatch({ type: 'CONFIRM_TEAMS_APPROVED', roomClosed, applications });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export default produce((draft, action) => {
  switch (action.type) {
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
      draft.roomClosed = action.roomClosed;
      draft.teamApplications = action.applications;
      return;
    default:
      return;
  }
});
