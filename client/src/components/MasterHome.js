import React from 'react';

import Logo from './Logo';
import Button from './Button';
import Container from './Container';
import Loader from './Loader';

import { useDispatch, useSelector } from 'react-redux';
import { createQuizzRoom } from '../reducers/quizz-master-app';

const MasterHome = () => {
  const dispatch = useDispatch();
  const isCreating = useSelector(state => state.quizzMasterApp.isCreating);

  const createRoom = () => {
    dispatch(createQuizzRoom());
  };

  return (
    <Container>
      <Logo />
      <Button disabled={isCreating} onClick={createRoom}>
        Host a game
      </Button>
      {isCreating && <Loader />}
    </Container>
  );
};

export default MasterHome;
