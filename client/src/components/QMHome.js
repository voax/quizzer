import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createRoom } from '../reducers/qm/room';
import Logo from './Logo';
import Button from './Button';
import Loader from './Loader';

import { Container, Row, Col } from 'react-grid-system';

const QMHome = () => {
  const isLoading = useSelector(state => state.loader.active);
  const websocketConnected = useSelector(state => state.websocket.connected);
  const dispatch = useDispatch();
  const handleClick = language => {
    dispatch(createRoom(language));
  };

  return websocketConnected ? (
    <Redirect to="/master/teams" />
  ) : (
    <Container className="full-screen center">
      <Row className="focus-center">
        <Col>
          <Logo />
          <h2>Host a game</h2>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Button
                onClick={() => handleClick('en')}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '16px' }}
              >
                English
              </Button>
              <Button
                onClick={() => handleClick('nl')}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              >
                Dutch
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default QMHome;
