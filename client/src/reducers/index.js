import { combineReducers } from 'redux';

import questions from './questions';
import scoreboard from './scoreboard';

export default combineReducers({
  questions,
  scoreboard,
});
