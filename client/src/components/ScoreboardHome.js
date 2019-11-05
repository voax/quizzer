import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-grid-system';
import { Redirect } from 'react-router-dom';

import { loginAsScoreboardViewer, fetchGameState } from '../reducers/scoreboard';
import { setLoaderAction, stopLoaderAction } from '../reducers/loader';
import { CenterLoader } from './Loader';
import Logo from './Logo';

const Header = () => {
  const round = useSelector(state => state.scoreboard.round);
  const questionNo = useSelector(state => state.scoreboard.questionNo);
  const category = useSelector(state => state.scoreboard.currentQuestion.category);
  const question = useSelector(state => state.scoreboard.currentQuestion.question);
  const answer = useSelector(state => state.scoreboard.currentQuestion.answer);
  const questionCompleted = useSelector(state => state.scoreboard.questionCompleted);
  const ended = useSelector(state => state.scoreboard.ended);

  return ended ? (
    <>
      <Logo center />
      <Row>
        <Col>
          <h1 style={{ textAlign: 'center', fontSize: '3rem', marginTop: '0' }}>Quizz Ended</h1>
        </Col>
      </Row>
    </>
  ) : (
    <>
      <Row>
        <Col>
          <h1 style={{ float: 'left' }}>Round {round}</h1>
        </Col>
        <Col>
          <h1 style={{ textAlign: 'center' }}>{category}</h1>
        </Col>
        <Col>
          <h1 style={{ float: 'right' }}>Question {questionNo}</h1>
        </Col>
      </Row>
      {!questionCompleted ? (
        <Row>
          <Col>
            <h1 style={{ textAlign: 'center', fontSize: '3rem' }}>Q: {question}</h1>
          </Col>
        </Row>
      ) : (
        <Col>
          <Col>
            <h1 style={{ textAlign: 'center', fontSize: '3rem' }}>A: {answer}</h1>
          </Col>
        </Col>
      )}
    </>
  );
};

const TeamStatus = ({ team, pos }) => {
  const questionClosed = useSelector(state => state.scoreboard.questionClosed);
  const questionCompleted = useSelector(state => state.scoreboard.questionCompleted);
  const ended = useSelector(state => state.scoreboard.ended);

  const styleLeft = { paddingLeft: '75px', paddingRight: '50px' };
  const styleRight = { paddingLeft: '50px', paddingRight: '75px' };

  if (!team) {
    return <Col style={pos % 2 ? styleLeft : styleRight} />;
  }

  return (
    <Col style={pos % 2 ? styleLeft : styleRight}>
      <div className="team-status">
        <div className="info">
          <span className="pos">{pos}</span>
          {ended || <span className="round-score">{team.roundScore}</span>}
          <span className="round-points">{team.roundPoints}</span>
        </div>
        <div className="team">
          <span className="name">{team.name}</span>
          {questionCompleted && !ended && (
            <>
              {team.guessCorrect ? (
                <span className="status" role="img" aria-label="Correct guess">
                  ✔️
                </span>
              ) : (
                <span className="status" role="img" aria-label="Incorrect guess">
                  ❌
                </span>
              )}
            </>
          )}
          {questionClosed || ended || (
            <>
              {!team.guess && (
                <span className="status" role="img" aria-label="The team is thinking of a guess">
                  💭
                </span>
              )}
            </>
          )}
        </div>
        {questionCompleted && !ended && (
          <div className="guess">
            <span className="guess">{team.guess || '-'}</span>
          </div>
        )}
      </div>
    </Col>
  );
};

const TeamStatuses = () => {
  const scoreboardTeams = useSelector(state => state.scoreboard.teams);

  if (!scoreboardTeams) {
    return <></>;
  }

  const teams = scoreboardTeams
    .slice()
    .sort((a, b) => b.roundPoints - a.roundPoints || b.roundScore - a.roundScore);

  return (
    <>
      <Row className="big top-anxiety">
        <TeamStatus pos={1} team={teams[0]} />
        <TeamStatus pos={2} team={teams[1]} />
      </Row>
      <Row className="big top-anxiety">
        <TeamStatus pos={3} team={teams[2]} />
        <TeamStatus pos={4} team={teams[3]} />
      </Row>
      <Row className="big top-anxiety">
        <TeamStatus pos={5} team={teams[4]} />
        <TeamStatus pos={6} team={teams[5]} />
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
    <Container fluid className="top-anxiety">
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
  const questionNo = useSelector(state => state.scoreboard.questionNo);
  const round = useSelector(state => state.scoreboard.round);

  useEffect(() => {
    if (!connectingToRoom && !triedConnectingToRoom) {
      dispatch(loginAsScoreboardViewer(roomCode));
    }
  }, [dispatch, roomCode, connectingToRoom, triedConnectingToRoom]);

  useEffect(() => {
    if (questionNo === 0 && round <= 0) {
      dispatch(setLoaderAction('Wait for the Quizz Master to start the Quizz.'));
    }
  }, [dispatch, round, questionNo]);

  useEffect(() => {
    return () => dispatch(stopLoaderAction());
  }, [dispatch]);

  if (questionNo === 0 && round <= 0) {
    return <CenterLoader />;
  } else if (!triedConnectingToRoom) {
    return <CenterLoader />;
  } else if (!connectedToRoom) {
    return <Redirect to="/scoreboard" />;
  }
  return <ScoreBoard />;
};

export default ScoreboardHome;
