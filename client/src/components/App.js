import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showValidation, hideValidation } from '../actions';
import Logo from './Logo';
import Loader from './Loader';
import Input from './Input';
import Button from './Button';

const App = () => {
  const isLoading = useSelector(state => state.teamApp.isLoading);
  const roomCodeValid = useSelector(state => state.teamApp.roomCode.valid);
  const teamValid = useSelector(state => state.teamApp.team.valid);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!roomCodeValid || !teamValid) {
      return dispatch(showValidation());
    }
    dispatch(hideValidation());
    alert('test');
  };

  return (
    <div className="container">
      <Logo />
      {isLoading ? (
        <Loader text="Waiting for the Quizz Master to start the game..." />
      ) : (
        <>
          <Input
            reducer="teamApp"
            item="roomCode"
            placeholder="Enter room code"
            textTransform="uppercase"
            minLength="4"
            maxLength="4"
            errorMessage="The room code must have 4 characters."
          />
          <Input 
            reducer="teamApp" 
            item="team" 
            placeholder="Enter team name" 
            maxLength="16" 
            errorMessage="The team name is incorrect (min: 1, max: 16)." 
          />
          <Button text="Play!" onClick={handleClick} />
        </>
      )}
    </div>
  );
};

export default App;
