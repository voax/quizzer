import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setLoaderAction, stopLoaderAction } from '../reducers/loader';

import Loader from './Loader';
import Input from './Input';
import Button from './Button';

const TeamRoom = () => {
  const isLoading = useSelector(state => state.loader.active);
  const websocketConnected = useSelector(state => state.websocket.connected);
  const open = useSelector(state => state.teamApp.question.open);
  const questionNo = useSelector(state => state.teamApp.question.number);
  const category = useSelector(state => state.teamApp.question.category);
  const question = useSelector(state => state.teamApp.question.question);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(setLoaderAction('Waiting for the Quizz Master to review the answers...'));
  };

  const handleChangeAnswer = () => {
    dispatch(stopLoaderAction());
  };

  return !websocketConnected ? (
    <Redirect to="/" />
  ) : isLoading || !open ? (
    <>
      <Loader /> {open && <Button onClick={handleChangeAnswer}>Change answer</Button>}
    </>
  ) : (
    <>
      <span className="question-number">{`Question ${questionNo}`}</span>
      <span className="category">{category}</span>
      <span className="question">{question}</span>
      <Input reducer="teamApp" item="guess" placeholder="Your answer" maxLength="60" />
      <Button onClick={handleSubmit}>Submit!</Button>
    </>
  );
};

export default TeamRoom;
