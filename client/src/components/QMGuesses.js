import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { useSelector } from 'react-redux';

import Button from './Button';

const Header = () => {
  const questionNo = useSelector(state => state.quizzMasterApp.question);
  const question = useSelector(state => state.quizzMasterApp.currentQuestion.question);
  const answer = useSelector(state => state.quizzMasterApp.currentQuestion.answer);

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

  if (!team) {
    return <Col />;
  }

  return (
    <Col>
      <div className="team-guess">
        <h3>{team.name}</h3>
        <h3>{team.guess || '-'}</h3>
        <Button type="small">
          <span role="img" aria-label="Approve answer">
            👍
          </span>
        </Button>
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
  return (
    <Row className="top-anxiety">
      <Col xs={4} push={{ xs: 4 }}>
        <Button>Next</Button>
      </Col>
    </Row>
  );
};

const QMGuesses = () => {
  return (
    <Container className="top-anxiety">
      <Header />
      <Guesses />
      <NextButton />
    </Container>
  );
};

export default QMGuesses;
