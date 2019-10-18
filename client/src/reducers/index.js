import { combineReducers } from 'redux';
import popUp from './pop-up';
import teamApp from './team-app';
import questions from './questions';
import scoreboard from './scoreboard';
import socket from './socket';

export default combineReducers({
  popUp,
  teamApp,
  questions,
  scoreboard,
  socket,
});
