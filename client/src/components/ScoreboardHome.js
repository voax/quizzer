import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-grid-system';
import { Redirect } from 'react-router-dom';

import { loginAsScoreboardViewer, fetchGameState } from '../reducers/scoreboard';
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

const Header = () => {
  const round = useSelector(state => state.scoreboard.round);
  const questionNo = useSelector(state => state.scoreboard.questionNo);
  const category = useSelector(state => state.scoreboard.category);
  const question = useSelector(state => state.scoreboard.question);

  return (
    <>
      <Row>
        <Col>
          <h3 style={{ float: 'left' }}>Round {round}</h3>
        </Col>
        <Col>
          <h3 style={{ textAlign: 'center' }}>Q{questionNo}</h3>
        </Col>
        <Col>
          <h3 style={{ float: 'right' }}>{category}</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1 style={{ textAlign: 'center' }}>{question}</h1>
        </Col>
      </Row>
    </>
  );
};

const TeamStatus = ({ team }) => {
  if (!team) {
    return <Col />;
  }

  return <Col>Wadup dit is een team bruv</Col>;
};

const TeamStatuses = () => {
  const teams = useSelector(state => state.scoreboard.teams).sort(
    (a, b) => a.roundScore < b.roundScore
  );

  return (
    <>
      <Row className="top-anxiety">
        <TeamStatus team={teams[0]} />
        <TeamStatus team={teams[1]} />
      </Row>
      <Row className="top-anxiety">
        <TeamStatus team={teams[2]} />
        <TeamStatus team={teams[3]} />
      </Row>
      <Row className="top-anxiety">
        <TeamStatus team={teams[4]} />
        <TeamStatus team={teams[5]} />
      </Row>
    </>
  );
};

const ScoreBoard = () => {
  const dispatch = useDispatch();
  const roomCode = useSelector(state => state.scoreboard.roomCode);

  useEffect(() => {
    dispatch(fetchGameState(roomCode));
  }, [dispatch, roomCode]);

  return (
    <Container className="top-anxiety">
      <Header />
      <TeamStatuses />
    </Container>
  );
};

const ScoreboardHome = ({
  match: {
    params: { roomCode },
  },
}) => {
  const dispatch = useDispatch();
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
  } else if (!connectedToRoom) {
    return <Redirect to="/" />;
  }
  return <ScoreBoard />;
};

export default ScoreboardHome;
