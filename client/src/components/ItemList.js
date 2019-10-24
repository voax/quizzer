import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { handleItemListChange } from '../reducers/quizz-master-app';

export const StaticItemList = ({ items, show }) => {
  return (
    <div className="item-list">
      <div className="content">
        <ul>
          {items.map(item => (
            <li key={item.id}>{item[show]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ItemList = ({ items, show, selectable, reducer, dispatchAs }) => {
  const dispatch = useDispatch();
  const selected = useSelector(state => state[reducer[0]][reducer[1]]);

  const onItemClick = item => {
    if (!selectable) {
      return;
    }
    dispatch(handleItemListChange(dispatchAs, item));
  };

  return (
    <div className="item-list">
      <div className="content">
        <ul>
          {items.map(item => (
            <li
              className={(selected || {}).id === item.id ? 'selected' : null}
              onClick={() => onItemClick(item)}
              key={item.id}
            >
              {item[show]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ItemList;
