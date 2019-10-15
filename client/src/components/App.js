import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { textInputHandler } from '../actions';
import Loader from './Loader';

const App = () => {
  const isLoading = useSelector(state => state.teamApp.isLoading);
  const team = useSelector(state => state.teamApp.team);
  const roomCode = useSelector(state => state.teamApp.roomCode);
  const dispatch = useDispatch();

  const handleChange = name => ({ target: { value } }) => {
    dispatch(textInputHandler(name, value));
  };

  return (
    <div className="container">
      <h1>Quizzer</h1>
      {isLoading ? (
        <Loader text="Waiting for the Quizz Master to start the game..." />
      ) : (
        <>
          <div className="label-input">
            <label for="roomCode">Room code</label>
            <input
              id="roomCode"
              placeholder="Enter 4-letter code"
              value={roomCode}
              onChange={handleChange('roomCode')}
            />
          </div>
          <div className="label-input">
            <label for="team">Team name</label>
            <input
              id="team"
              placeholder="Enter your team name"
              value={team}
              onChange={handleChange('team')}
            />
          </div>
          <button>Play!</button>
        </>
      )}
    </div>
  );
};

export default App;
