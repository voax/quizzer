import React, { useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Button from './Button';
import { fetchRoomState, closeRoomQuestion, questionCompleted } from '../reducers/qm/room';
import { toggleGuessCorrect } from '../reducers/qm/guess';

const Header = () => {
  const questionNo = useSelector(state => state.quizzMasterApp.question);
  const round = useSelector(state => state.quizzMasterApp.round);
  const { question, answer } = useSelector(state => state.quizzMasterApp.currentQuestion);

  return (
    <Row>
      <Col xs={8} push={{ xs: 2 }} style={{ textAlign: 'center' }}>
        <h1>
          Round {round} Question {questionNo}
        </h1>
        <h2>Q: {question}</h2>
        <h2>A: {answer}</h2>
      </Col>
    </Row>
  );
};

const TeamGuess = ({ team: teamNo }) => {
  const dispatch = useDispatch();
  const roomCode = useSelector(state => state.quizzMasterApp.roomCode);
  const team = useSelector(state => state.quizzMasterApp.approvedTeamApplications[teamNo]);
  const questionClosed = useSelector(state => state.quizzMasterApp.questionClosed);
  const approvingATeamGuess = useSelector(state => state.quizzMasterApp.approvingATeamGuess);

  const toggleGuess = useCallback(() => {
    dispatch(toggleGuessCorrect(roomCode, team._id, !team.guessCorrect));
  }, [roomCode, team, dispatch]);

  if (!team) {
    return <Col />;
  }
  return (
    <Col>
      <div className="team-guess">
        <h3>{team.name}</h3>
        <h3>{team.guess || '-'}</h3>

        {questionClosed && (
          <Button type="small" onClick={toggleGuess} disabled={approvingATeamGuess || !team.guess}>
            {team.guessCorrect ? (
              <span role="img" aria-label={`Approve team ${team.name}'s guess`}>
                👍
              </span>
            ) : (
              <span role="img" aria-label={`Reject team ${team.name}'s guess`}>
                👎
              </span>
            )}
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
          <Button
            onClick={() => {
              dispatch(questionCompleted(roomCode));
            }}
          >
            Next
          </Button>
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
  const currentQuestion = useSelector(state => state.quizzMasterApp.currentQuestion);

  useEffect(() => {
    dispatch(fetchRoomState(roomCode));
  }, [dispatch, roomCode]);

  if (!currentQuestion) {
    return <Redirect to="/master/categories" />;
  }

  return (
    <Container className="top-anxiety">
      <Header />
      <Guesses />
      <NextButton />
    </Container>
  );
};

export default QMGuesses;
