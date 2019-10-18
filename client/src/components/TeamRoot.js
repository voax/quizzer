import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TeamHome from './TeamHome';
import TeamRoom from './TeamRoom';
import Logo from './Logo';
import Loader from './Loader';

const TeamRoot = () => {
  const isLoading = useSelector(state => state.teamApp.isLoading);

  return (
    <div className="container">
      <Logo />
      {isLoading ? (
        <Loader text="Waiting for the Quizz Master to start the game..." />
      ) : (
        <Switch>
          <Route exact path="/room">
            <TeamRoom />
          </Route>
          <Route>
            <TeamHome />
          </Route>
        </Switch>
      )}
    </div>
  );
};

export default TeamRoot;
