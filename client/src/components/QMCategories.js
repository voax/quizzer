import React from 'react';
import { withRouter } from 'react-router-dom';

const QMCategories = ({
  match: {
    params: { roundNo },
  },
}) => {
  return <div>Select categories for round {roundNo}</div>;
};

export default withRouter(QMCategories);
