import React from 'react';
import { useDispatch } from 'react-redux';
import { scoreboardDecrement, scoreboardIncrement } from '../actions';

const ScoreboardItem = ({ team, score }) => {
  const dispatch = useDispatch();
  return (
    <>
      <h2>{team}</h2>
      <h3>{score} points</h3>
      <button onClick={() => dispatch(scoreboardIncrement(team))}>+</button>
      <button onClick={() => dispatch(scoreboardDecrement(team))}>-</button>
      <hr />
    </>
  );
};

export default ScoreboardItem;
