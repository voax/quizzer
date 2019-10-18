import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ScoreboardHome from './ScoreboardHome';
import ScoreboardLogin from './ScoreboardLogin';

const ScoreboardRoot = () => {
  return (
    <Switch>
      <Route
        path="/scoreboard/:roomCode"
        render={routeProps => <ScoreboardHome {...routeProps} />}
      />
      <Route path="/scoreboard">
        <ScoreboardLogin />
      </Route>
    </Switch>
  );
};

export default ScoreboardRoot;
