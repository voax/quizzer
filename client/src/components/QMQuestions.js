import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-grid-system';
import { Redirect } from 'react-router-dom';

import { fetchQuestions, confirmQuestionAndContinue } from '../reducers/qm/question';
import Button from './Button';
import ItemList from './ItemList';
import ItemListHeader from './ItemListHeader';
import { CenterLoader } from './Loader';
import Logo from './Logo';

const QMQuestions = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.loader.active);
  const code = useSelector(state => state.quizzMasterApp.roomCode);
  const roundNo = useSelector(state => state.quizzMasterApp.round);
  const questionNo = useSelector(state => state.quizzMasterApp.question);
  const selectedCategories = useSelector(state => state.quizzMasterApp.selectedCategories);
  const questions = useSelector(state => state.quizzMasterApp.questions);
  const questionsAsked = useSelector(state => state.quizzMasterApp.questionsAsked);
  const selectedQuestion = useSelector(state => state.quizzMasterApp.selectedQuestion);
  const currentQuestion = useSelector(state => state.quizzMasterApp.currentQuestion);

  useEffect(() => {
    dispatch(fetchQuestions(selectedCategories));
  }, [dispatch, selectedCategories]);

  if (currentQuestion) {
    return <Redirect to="/master/guesses" />;
  } else if (isLoading) {
    return <CenterLoader />;
  }

  return (
    <Container className="top-anxiety">
      <Logo center />
      <div className="round-question">
        <span>Round: {roundNo}</span>
        <span>Question: {questionNo + 1}</span>
      </div>
      <Row>
        {selectedCategories.map(category => {
          return (
            <Col key={`${category.id}-1`}>
              <ItemListHeader>{category.category}</ItemListHeader>
            </Col>
          );
        })}
      </Row>
      <Row>
        {selectedCategories.map(category => (
          <Col key={`${category.id}-2`}>
            <ItemList
              items={questions
                .reduce((acc, cur) => {
                  return cur.category === category.category && !questionsAsked.includes(cur._id)
                    ? acc.concat({ id: cur._id, ...cur })
                    : acc;
                }, [])
                .slice(0, 5)}
              show="question"
              selectable
              reducer={['quizzMasterApp', 'selectedQuestion']}
              dispatchAs="QUESTIONS"
            />
          </Col>
        ))}
      </Row>
      <Row className="top-anxiety bottom-anxiety">
        <Col></Col>
        <Col>
          <Button
            disabled={!selectedQuestion}
            onClick={() => dispatch(confirmQuestionAndContinue(code, selectedQuestion))}
          >
            Start question
          </Button>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default QMQuestions;
