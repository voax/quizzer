import React from 'react';
import { useSelector } from 'react-redux';
// import { fetchQuestions } from '../../reducers/qustions';
import ScoreboardItem from './ScoreboardItem';

const ScoreboardHome = ({ match }) => {
  const scoreboard = useSelector(state => state.scoreboard);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(fetchQuestions());
  // }, []);

  console.log(match);
  return (
    <>
      {scoreboard.map(({ team, score }) => (
        <ScoreboardItem key={team} team={team} score={score} />
      ))}
    </>
  );
};

export default ScoreboardHome;
