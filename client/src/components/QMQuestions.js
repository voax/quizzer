import React from 'react';
import { withRouter } from 'react-router-dom';

const QMQuestions = ({
  match: {
    params: { roundNo, questionNo },
  },
}) => {
  return (
    <div>
      Round {roundNo} question {questionNo}
    </div>
  );
};

export default withRouter(QMQuestions);
