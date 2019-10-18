import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showPopUpAction } from '../reducers/pop-up';
import Input from './Input';
import Button from './Button';

const TeamHome = () => {
  const roomCodeValid = useSelector(state => state.teamApp.roomCode.valid);
  const teamValid = useSelector(state => state.teamApp.team.valid);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(showPopUpAction('ERROR', 'Room code is invalid.'));
  };

  return (
    <>
      <Input
        reducer="teamApp"
        item="roomCode"
        labelText="Room code"
        placeholder="Enter 4-letter code"
        textTransform="uppercase"
        minLength="4"
        maxLength="4"
      />
      <Input
        reducer="teamApp"
        item="team"
        labelText="Team name"
        placeholder="Enter your team name"
        maxLength="12"
        showCounter
      />
      <Button onClick={handleClick} disabled={!roomCodeValid || !teamValid}>
        Play!
      </Button>
    </>
  );
};

export default TeamHome;
