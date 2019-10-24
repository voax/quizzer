import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createRoom } from '../reducers/quizz-master-app';
import Logo from './Logo';
import Button from './Button';
import Loader from './Loader';

import { Container, Row, Col } from 'react-grid-system';

const QMHome = () => {
  const isLoading = useSelector(state => state.loader.active);
  const websocketConnected = useSelector(state => state.websocket.connected);
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(createRoom());
  };

  return websocketConnected ? (
    <Redirect to="/master/teams" />
  ) : (
    <Container className="full-screen center">
      <Row className="focus-center">
        <Col>
          <Logo />
          {isLoading ? <Loader /> : <Button onClick={handleClick}>Host a game</Button>}
        </Col>
      </Row>
    </Container>
  );
};

export default QMHome;
