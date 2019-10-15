import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuestions } from '../actions';
import ScoreboardItem from './ScoreboardItem';

const Scoreboard = () => {
  const scoreboard = useSelector(state =>
    state.scoreboard.map(({ team, score }) => (
      <ScoreboardItem key={team} team={team} score={score} />
    ))
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuestions());
  }, []);

  return <>{scoreboard}</>;
};

export default Scoreboard;
