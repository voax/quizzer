import { combineReducers } from 'redux';

import teamApp from './team-app';
import questions from './questions';
import scoreboard from './scoreboard';
import socket from './socket';

export default combineReducers({
  teamApp,
  questions,
  scoreboard,
  socket,
});
