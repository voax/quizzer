import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { textInputHandler } from '../actions';

const Input = ({
  reducer,
  item,
  textTransform = 'none',
  placeholder,
  minLength = 1,
  maxLength = 24,
  errorMessage = 'Input is invalid.',
}) => {
  const showValidation = useSelector(state => state[reducer].showValidation);
  const value = useSelector(state => state[reducer][item].value);
  const valid = useSelector(state => state[reducer][item].valid);
  const dispatch = useDispatch();

  const handleChange = () => ({ target: { value } }) => {
    dispatch(textInputHandler(item, value, minLength, maxLength));
  };

  return (
    <>
      {showValidation && !valid && <div className="error-message">{errorMessage}</div>}
      <input
        id={item}
        className={showValidation && !valid ? 'invalid' : ''}
        style={{ textTransform }}
        placeholder={placeholder}
        value={value}
        onChange={handleChange()}
      />
    </>
  );
};

export default Input;
