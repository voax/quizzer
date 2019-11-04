import React from 'react';
import { Container, Row, Col, Hidden } from 'react-grid-system';
import { Link } from 'react-router-dom';

import Logo from './Logo';
import Button from './Button';

const Card = ({ title, subtitle, link, button }) => (
  <div className="card">
    <h2>{title}</h2>
    <h3>{subtitle}</h3>
    <Link to={link}>
      <Button>{button}</Button>
    </Link>
  </div>
);

const Home = () => {
  return (
    <Container className="home-page top-anxiety">
      <Logo center />
      <Row>
        <Hidden xs>
          <Col lg={4}>
            <Card
              title="Quizz Master"
              subtitle="Become a Quizz Master and host a Quizz Night!"
              link="/master"
              button="Start!"
            />
          </Col>
        </Hidden>
        <Col lg={4}>
          <Card
            title="Team"
            subtitle="Apply as a Team to join a Quizz Night!"
            link="/team"
            button="Join!"
          />
        </Col>
        <Hidden xs>
          <Col lg={4}>
            <Card
              title="Scoreboard"
              subtitle="Set up a scoreboard of your Quizz and view the rankings!"
              link="/scoreboard"
              button="View!"
            />
          </Col>
        </Hidden>
      </Row>
    </Container>
  );
};

export default Home;
