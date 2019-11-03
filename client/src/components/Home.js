import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { Link } from 'react-router-dom';

import Logo from './Logo';
import Button from './Button';

const Home = () => {
  return (
    <Container className="home-page top-anxiety">
      <Logo center />
      <Row>
        <Col>
          <div className="card">
            <h2>Quizz Master</h2>
            <h3>Become a Quizz Master, host a Quizz Night and let teams apply to your Quizz!</h3>
            <Link to="/master">
              <Button>Start!</Button>
            </Link>
          </div>
        </Col>
        <Col>
          <div className="card">
            <h2>Team</h2>
            <h3>Apply as a Team with only a valid room code and team name to apply to a Quizz!</h3>
            <Link to="/team">
              <Button>Join!</Button>
            </Link>
          </div>
        </Col>
        <Col>
          <div className="card">
            <h2>Scoreboard</h2>
            <h3>Set up a scoreboard of your Quizz and view the rankings!</h3>
            <br />
            <Link to="/scoreboard">
              <Button>View!</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
