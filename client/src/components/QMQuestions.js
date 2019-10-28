import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-grid-system';

import { fetchQuestions } from '../reducers/quizz-master-app';
import Button from './Button';
import ItemList from './ItemList';
import ItemListHeader from './ItemListHeader';
import Loader from './Loader';
import Logo from './Logo';

const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]];
  }
  return array;
};

const QMQuestions = () => {
  const dispatch = useDispatch();
  const code = useSelector(state => state.quizzMasterApp.roomCode);
  const roundNo = useSelector(state => state.quizzMasterApp.round);
  const selectedCategories = useSelector(state => state.quizzMasterApp.selectedCategories);
  const questions = useSelector(state => state.quizzMasterApp.questions);
  const questionsAsked = useSelector(state => state.quizzMasterApp.questionsAsked);

  useEffect(() => {
    if (questions.length === 0) {
      dispatch(fetchQuestions(selectedCategories));
    }
  }, [dispatch]);

  return (
    <Container className="top-anxiety">
      <Logo center />
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
              items={shuffle(
                questions.reduce((acc, cur) => {
                  return cur.category === category.category &&
                    questionsAsked.some(askedQ => askedQ._id !== cur._id)
                    ? acc.concat({ id: cur._id, question: cur.question })
                    : acc;
                }, [])
              )}
              show="question"
              selectable
              reducer={['quizzMasterApp', 'selectedQuestion']}
              dispatchAs="QUESTIONS"
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default QMQuestions;
