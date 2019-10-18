import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MasterHome from './MasterHome';
import MasterSelectTeams from './MasterSelectTeams';
import MasterSelectCategories from './MasterSelectCategories';
import MasterRoundQuestion from './MasterRoundQuestion';

const MasterRoot = () => {
  return (
    <Switch>
      <Route exact path="/master">
        <MasterHome />
      </Route>
      <Route path="/master/teams">
        <MasterSelectTeams />
      </Route>
      <Route path="/master/round/:roundNo/categories">
        <MasterSelectCategories />
      </Route>
      <Route path="/master/round/:roundNo/question/:questionNo">
        <MasterRoundQuestion />
      </Route>
    </Switch>
  );
};

export default MasterRoot;
