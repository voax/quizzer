import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { textInputHandlerAction } from '../reducers/team-app';

const Input = ({
  reducer,
  item,
  labelText = false,
  textTransform = 'none',
  placeholder,
  minLength = 1,
  maxLength = 24,
  showCounter = false,
}) => {
  const value = useSelector(state => state[reducer][item].value);
  const dispatch = useDispatch();

  const handleChange = () => ({ target: { value } }) => {
    dispatch(textInputHandlerAction(item, value, minLength, maxLength));
  };

  return (
    <>
      {labelText && (
        <label>
          {`${labelText} `}
          {showCounter && <span className="char-remaining">{maxLength - value.length}</span>}
        </label>
      )}
      <input
        id={item}
        style={{ textTransform }}
        placeholder={placeholder}
        value={value}
        onChange={handleChange()}
        minLength={minLength}
        maxLength={maxLength}
      />
    </>
  );
};

export default Input;
