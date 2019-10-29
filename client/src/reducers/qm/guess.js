import produce from 'immer';

import { fetchApiSendJson } from '../../utils';
import { checkFetchError } from '../../utils';
import { showPopUpAction } from '../pop-up';

export const toggleGuessCorrect = (roomCode, teamID, correct) => async dispatch => {
  try {
    dispatch({ type: 'START_APPROVING_TEAM_GUESS' });
    const response = await fetchApiSendJson(`rooms/${roomCode}/teams/${teamID}`, 'PATCH', {
      guessCorrect: correct,
    });
    const { teams } = await checkFetchError(response);
    dispatch({ type: 'TEAM_GUESS_APPROVED', teams });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch({ type: 'STOP_APPROVING_TEAM_GUESS' });
  }
};

export default produce((draft, action) => {
  switch (action.type) {
    case 'START_APPROVING_TEAM_GUESS':
      draft.approvingATeamGuess = true;
      return;
    case 'STOP_APPROVING_TEAM_GUESS':
      draft.approvingATeamGuess = false;
      return;
    case 'TEAM_GUESS_APPROVED':
      draft.approvedTeamApplications = action.teams;
      return;
    default:
      return;
  }
});
