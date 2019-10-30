import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-grid-system';
import { Redirect } from 'react-router-dom';

import { loginAsScoreboardViewer } from '../reducers/scoreboard';
import Loader from './Loader';

const CenterLoader = () => {
  return (
    <Container fluid className="full-screen center">
      <Row className="focus-center">
        <Col>
          <Loader />
        </Col>
      </Row>
    </Container>
  );
};

const ScoreboardHome = ({
  match: {
    params: { roomCode },
  },
}) => {
  const dispatch = useDispatch();
  const sbRoomCode = useSelector(state => state.scoreboard.roomCode);
  const triedConnectingToRoom = useSelector(state => state.scoreboard.triedConnectingToRoom);
  const connectedToRoom = useSelector(state => state.scoreboard.connectedToRoom);
  const connectingToRoom = useSelector(state => state.scoreboard.connectingToRoom);

  useEffect(() => {
    if (!connectingToRoom && !triedConnectingToRoom) {
      dispatch(loginAsScoreboardViewer(roomCode));
    }
  }, [dispatch, roomCode, connectingToRoom, triedConnectingToRoom]);

  if (!triedConnectingToRoom) {
    return <CenterLoader />;
  }
  if (!connectedToRoom) {
    return <Redirect to="/" />;
  }

  return <h1>{sbRoomCode} Here come's the Quizzer Scoreboard</h1>;
};

export default ScoreboardHome;
