import React from 'react';
import { useDispatch } from 'react-redux';
import { scoreboardDecrementAction, scoreboardIncrementAction } from '../reducers/scoreboard';

const ScoreboardItem = ({ team, score }) => {
  const dispatch = useDispatch();
  return (
    <>
      <h2>{team}</h2>
      <h3>{score} points</h3>
      <button onClick={() => dispatch(scoreboardIncrementAction(team))}>+</button>
      <button onClick={() => dispatch(scoreboardDecrementAction(team))}>-</button>
      <hr />
    </>
  );
};

export default ScoreboardItem;
