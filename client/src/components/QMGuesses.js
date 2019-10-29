import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { useSelector, useDispatch } from 'react-redux';

import Button from './Button';
import { fetchRoomState, closeRoomQuestion } from '../reducers/qm/room';

const Header = () => {
  const questionNo = useSelector(state => state.quizzMasterApp.question);
  const { question, answer } = useSelector(state => state.quizzMasterApp.currentQuestion);

  return (
    <Row>
      <Col xs={8} push={{ xs: 2 }} style={{ textAlign: 'center' }}>
        <h1>Question {questionNo}</h1>
        <h2>Q: {question}</h2>
        <h2>A: {answer}</h2>
      </Col>
    </Row>
  );
};

const TeamGuess = ({ team: teamNo }) => {
  const team = useSelector(state => state.quizzMasterApp.approvedTeamApplications[teamNo]);
  const questionClosed = useSelector(state => state.quizzMasterApp.questionClosed);

  if (!team) {
    return <Col />;
  }

  return (
    <Col>
      <div className="team-guess">
        <h3>{team.name}</h3>
        <h3>{team.guess || '-'}</h3>
        {questionClosed && (
          <Button type="small">
            <span role="img" aria-label="Approve answer">
              👍
            </span>
          </Button>
        )}
      </div>
    </Col>
  );
};

const Guesses = () => {
  return (
    <>
      <Row className="top-anxiety">
        <TeamGuess team={0} />
        <TeamGuess team={1} />
        <TeamGuess team={2} />
      </Row>
      <Row className="top-anxiety">
        <TeamGuess team={3} />
        <TeamGuess team={4} />
        <TeamGuess team={5} />
      </Row>
    </>
  );
};

const NextButton = () => {
  const dispatch = useDispatch();
  const questionClosed = useSelector(state => state.quizzMasterApp.questionClosed);
  const roomCode = useSelector(state => state.quizzMasterApp.roomCode);

  return (
    <Row className="top-anxiety">
      <Col xs={4} push={{ xs: 4 }}>
        {questionClosed ? (
          <Button>Next</Button>
        ) : (
          <Button
            onClick={() => {
              dispatch(closeRoomQuestion(roomCode));
            }}
          >
            Close Question
          </Button>
        )}
      </Col>
    </Row>
  );
};

const QMGuesses = () => {
  const dispatch = useDispatch();
  const roomCode = useSelector(state => state.quizzMasterApp.roomCode);

  useEffect(() => {
    dispatch(fetchRoomState(roomCode));
  }, [dispatch, roomCode]);

  return (
    <Container className="top-anxiety">
      <Header />
      <Guesses />
      <NextButton />
    </Container>
  );
};

export default QMGuesses;
