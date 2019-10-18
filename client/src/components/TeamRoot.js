import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TeamHome from './TeamHome';
import TeamRoom from './TeamRoom';
import Logo from './Logo';
import Container from './Container';

const TeamRoot = () => {
  return (
    <Container>
      <Logo />
      <Switch>
        <Route exact path="/room">
          <TeamRoom />
        </Route>
        <Route>
          <TeamHome />
        </Route>
      </Switch>
    </Container>
  );
};

export default TeamRoot;
