import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoaderAction, stopLoaderAction } from '../reducers/loader';
import Loader from './Loader';
import Input from './Input';
import Button from './Button';

const TeamRoom = () => {
  const isLoading = useSelector(state => state.loader.active);
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

  return isLoading || !open ? (
    <>
      <Loader /> {open && <Button text="Change answer" onClick={handleChangeAnswer} />}
    </>
  ) : (
    <div className="team-room">
      <span className="question-number">{`Question ${questionNo}`}</span>
      <span className="category">{category}</span>
      <span className="question">{question}</span>
      <Input reducer="teamApp" item="guess" placeholder="Your answer" maxLength="60" />
      <Button onClick={handleSubmit} />
    </div>
  );
};

export default TeamRoom;
