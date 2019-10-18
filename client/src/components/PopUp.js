import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hidePopUpAction } from '../reducers/pop-up';
import Button from './Button';

const PopUp = () => {
  const title = useSelector(state => state.teamApp.popUp.title);
  const message = useSelector(state => state.teamApp.popUp.message);
  const button = useSelector(state => state.teamApp.popUp.button);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(hidePopUpAction());
  };

  return (
    <div className="overlay show">
      <div className="popup">
        <span className="title">{title}</span>
        <span className="message">{message}</span>
        <Button type="small" text={button} onClick={handleClick} />
      </div>
    </div>
  );
};

export default PopUp;
