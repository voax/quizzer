import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TeamHome from './TeamHome';
import TeamRoom from './TeamRoom';
import Logo from './Logo';

import { Container, Row, Col } from 'react-grid-system';

const Team = () => {
  return (
    <Container fluid className="full-screen center">
      <Row className="focus-center">
        <Col>
          <Logo center />
          <Switch>
            <Route exact path="/room">
              <TeamRoom />
            </Route>
            <Route>
              <TeamHome />
            </Route>
          </Switch>
        </Col>
      </Row>
    </Container>
  );
};

export default Team;
