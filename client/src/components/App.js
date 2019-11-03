import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PopUp from './PopUp';
import Home from './Home';
import Team from './Team';
import QM from './QM';
import Scoreboard from './Scoreboard';

const App = () => {
  const popUpActive = useSelector(state => state.popUp.active);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/team">
          <Team />
        </Route>
        <Route path="/master">
          <QM />
        </Route>
        <Route path="/scoreboard">
          <Scoreboard />
        </Route>
      </Switch>
      {popUpActive && <PopUp />}
    </Router>
  );
};

export default App;
