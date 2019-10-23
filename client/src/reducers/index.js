import { combineReducers } from 'redux';
import popUp from './pop-up';
import loader from './loader';
import teamApp from './team-app';
import questions from './questions';
import scoreboard from './scoreboard';
import quizzMasterApp from './quizz-master-app';

export default combineReducers({
  popUp,
  loader,
  teamApp,
  questions,
  scoreboard,
  quizzMasterApp,
});
