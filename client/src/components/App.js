import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showPopUp } from '../actions';
import PopUp from './PopUp';
import Logo from './Logo';
import Loader from './Loader';
import Input from './Input';
import Button from './Button';

const App = () => {
  const popUpActive = useSelector(state => state.teamApp.popUp.active);
  const isLoading = useSelector(state => state.teamApp.isLoading);
  const roomCodeValid = useSelector(state => state.teamApp.roomCode.valid);
  const teamValid = useSelector(state => state.teamApp.team.valid);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(showPopUp('ERROR', 'Room code is invalid.'));
  };

  return (
    <>
      <div className="container">
        <Logo />
        {isLoading ? (
          <Loader text="Waiting for the Quizz Master to start the game..." />
        ) : (
          <>
            <Input
              reducer="teamApp"
              item="roomCode"
              labelText="Room code"
              placeholder="Enter 4-letter code"
              textTransform="uppercase"
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
            <Button text="Play!" onClick={handleClick} disabled={!roomCodeValid || !teamValid} />
          </>
        )}
      </div>
      {popUpActive && <PopUp />}
    </>
  );
};

export default App;
