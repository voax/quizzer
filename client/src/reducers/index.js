import { combineReducers } from 'redux';
import popUp from './pop-up';
import teamApp from './team-app';
import questions from './questions';
import scoreboard from './scoreboard';

export default combineReducers({
  popUp,
  teamApp,
  questions,
  scoreboard,
});
