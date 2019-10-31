import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ScoreboardLogin from './ScoreboardLogin';
import ScoreboardHome from './ScoreboardHome';

const Scoreboard = () => {
  return (
    <Switch>
      <Route exact path="/scoreboard">
        <ScoreboardLogin />
      </Route>
      <Route
        path="/scoreboard/:roomCode"
        render={routeProps => <ScoreboardHome {...routeProps} />}
      />
    </Switch>
  );
};

export default Scoreboard;
