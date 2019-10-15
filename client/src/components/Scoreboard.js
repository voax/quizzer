import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuestions } from '../actions';
import ScoreboardItem from './ScoreboardItem';

const Scoreboard = () => {
  const scoreboard = useSelector(state => state.scoreboard);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuestions());
  }, []);

  return (
    <>
      {scoreboard.map(({ team, score }) => (
        <ScoreboardItem key={team} team={team} score={score} />
      ))}
    </>
  );
};

export default Scoreboard;
