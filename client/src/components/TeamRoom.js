import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { stopLoaderAction } from '../reducers/loader';
import { submitGuess } from '../reducers/team-app';

import Loader from './Loader';
import Input from './Input';
import Button from './Button';

const TeamRoom = () => {
  const isLoading = useSelector(state => state.loader.active);
  const roomCode = useSelector(state => state.teamApp.roomCode.value);
  const teamID = useSelector(state => state.teamApp.teamID);
  const roundNo = useSelector(state => state.teamApp.roundNo);
  const open = useSelector(state => state.teamApp.question.open);
  const questionNo = useSelector(state => state.teamApp.question.number);
  const category = useSelector(state => state.teamApp.question.category);
  const question = useSelector(state => state.teamApp.question.question);
  const guess = useSelector(state => state.teamApp.guess.value);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(submitGuess(roomCode, teamID, guess));
  };

  const handleChangeAnswer = () => {
    dispatch(stopLoaderAction());
  };

  return isLoading || !open ? (
    <>
      <Loader /> {open && <Button onClick={handleChangeAnswer}>Change answer</Button>}
    </>
  ) : (
    <>
      <span className="round-number">{`Round ${roundNo}`}</span>
      <span className="question-number">{`Question ${questionNo}`}</span>
      <span className="category">{category}</span>
      <span className="question">{question}</span>
      <Input reducer="teamApp" item="guess" placeholder="Your answer" labelText="Answer" maxLength="50" showCounter />
      <Button onClick={handleSubmit}>Submit!</Button>
    </>
  );
};

export default TeamRoom;
