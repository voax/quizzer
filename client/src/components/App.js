import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PopUp from './PopUp';
import TeamRoot from './TeamRoot';
import MasterHome from './MasterRoot';
import ScoreboardRoot from './ScoreboardRoot';

const App = () => {
  const popUpActive = useSelector(state => state.popUp.active);

  return (
    <Router>
      <Switch>
        <Route path="/master">
          <MasterHome />
        </Route>
        <Route path="/scoreboard">
          <ScoreboardRoot />
        </Route>
        <Route path="/">
          <TeamRoot />
        </Route>
      </Switch>
      {popUpActive && <PopUp />}
    </Router>
  );
};

export default App;
