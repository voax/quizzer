import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

import QMHome from './QMHome';
import QMTeams from './QMTeams';
import QMCategories from './QMCategories';
import QMQuestions from './QMQuestions';
import QMGuesses from './QMGuesses';

const QM = ({ location: { pathname } }) => {
  const connected = useSelector(state => state.websocket.connected);

  if (pathname !== '/master' && !connected) {
    return <Redirect to="/master" />;
  }

  return (
    <Switch>
      <Route exact path="/master">
        <QMHome />
      </Route>
      <Route path="/master/teams">
        <QMTeams />
      </Route>
      <Route path="/master/categories">
        <QMCategories />
      </Route>
      <Route path="/master/questions">
        <QMQuestions />
      </Route>
      <Route path="/master/guesses">
        <QMGuesses />
      </Route>
    </Switch>
  );
};

export default withRouter(QM);
