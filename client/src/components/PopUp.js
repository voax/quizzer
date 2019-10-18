import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hidePopUpAction } from '../reducers/pop-up';
import Button from './Button';

const PopUp = () => {
  const title = useSelector(state => state.popUp.title);
  const message = useSelector(state => state.popUp.message);
  const button = useSelector(state => state.popUp.button);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(hidePopUpAction());
  };

  return (
    <div className="overlay show">
      <div className="popup">
        <span className="title">{title}</span>
        <span className="message">{message}</span>
        <Button type="small" onClick={handleClick}>
          {button}
        </Button>
      </div>
    </div>
  );
};

export default PopUp;
