import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { applyTeam } from '../reducers/team-app';
import Loader from './Loader';
import Input from './Input';
import Button from './Button';

const TeamHome = () => {
  const connected = useSelector(state => state.websocket.connected);
  const isLoading = useSelector(state => state.loader.active);
  const roomCodeValid = useSelector(state => state.teamApp.roomCode.valid);
  const roomCodeValue = useSelector(state => state.teamApp.roomCode.value);
  const teamValid = useSelector(state => state.teamApp.team.valid);
  const teamValue = useSelector(state => state.teamApp.team.value);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(applyTeam(roomCodeValue, teamValue));
  };

  if (connected) {
    return <Redirect to="/team/room" />;
  }

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Input
        reducer="teamApp"
        item="roomCode"
        labelText="Room code"
        placeholder="Enter 4-letter code"
        uppercase
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
