import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TeamHome from './TeamHome';
import TeamRoom from './TeamRoom';
import Logo from './Logo';

const TeamRoot = () => {
  return (
    <div className="container">
      <Logo />
      <Switch>
        <Route exact path="/room">
          <TeamRoom />
        </Route>
        <Route>
          <TeamHome />
        </Route>
      </Switch>
    </div>
  );
};

export default TeamRoot;
