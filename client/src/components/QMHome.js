import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createRoom } from '../reducers/quizz-master-app';
import Logo from './Logo';
import Button from './Button';
import Container from './Container';
import Loader from './Loader';

const QMHome = () => {
  const isLoading = useSelector(state => state.loader.active);
  const hasRoomCode = useSelector(state => state.loader.active);
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(createRoom());
  };

  return hasRoomCode ? (
    <Redirect to="/master/teams" />
  ) : (
    <Container>
      <Logo />
      {isLoading ? <Loader /> : <Button onClick={handleClick}>Host a game</Button>}
    </Container>
  );
};

export default QMHome;
