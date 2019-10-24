import React from 'react';

const ItemListHeader = ({ children, ...rest }) => {
  return <h2 {...rest}>{children}</h2>;
};

export default ItemListHeader;
