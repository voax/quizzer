import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MasterHome from './MasterHome';

const MasterRoot = () => {
  return (
    <Switch>
      <Route path="/master">
        <MasterHome />
      </Route>
    </Switch>
  );
};

export default MasterRoot;
