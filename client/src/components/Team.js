import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TeamHome from './TeamHome';
import TeamRoom from './TeamRoom';
import Logo from './Logo';

import { Container, Row, Col } from 'react-grid-system';

const Team = ({ location: { pathname } }) => {
  const connected = useSelector(state => state.websocket.connected);

  if (pathname !== '/' && !connected) {
    return <Redirect to="/" />;
  }

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

export default withRouter(Team);
