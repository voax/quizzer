import { combineReducers } from 'redux';
import popUp from './pop-up';
import teamApp from './team-app';
import questions from './questions';
import scoreboard from './scoreboard';
import socket from './socket';
import quizzMasterApp from './quizz-master-app';

export default combineReducers({
  popUp,
  teamApp,
  questions,
  scoreboard,
  socket,
  quizzMasterApp,
});
