import { combineReducers } from 'redux';
import websocket from './websocket';
import popUp from './pop-up';
import loader from './loader';
import teamApp from './team-app';
import scoreboard from './scoreboard';
import quizzMasterApp from './qm';

export default combineReducers({
  websocket,
  popUp,
  loader,
  teamApp,
  scoreboard,
  quizzMasterApp,
});
