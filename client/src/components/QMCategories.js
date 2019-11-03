import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-grid-system';
import { Redirect } from 'react-router-dom';

import Button from './Button';
import ItemList from './ItemList';
import ItemListHeader from './ItemListHeader';
import {
  fetchCategories,
  selectCategory,
  deselectCategory,
  confirmCategoriesAndContinue,
} from '../reducers/qm/category';
import { endQuizz } from '../reducers/qm/room';
import { CenterLoader } from './Loader';
import Logo from './Logo';

const QMCategories = () => {
  const dispatch = useDispatch();
  const code = useSelector(state => state.quizzMasterApp.roomCode);
  const roundNo = useSelector(state => state.quizzMasterApp.round);
  const isLoading = useSelector(state => state.loader.active);
  const categories = useSelector(state => state.quizzMasterApp.categories);
  const selectedCategories = useSelector(state => state.quizzMasterApp.selectedCategories);
  const selectedCategory = useSelector(state => state.quizzMasterApp.selectedCategory);
  const roundStarted = useSelector(state => state.quizzMasterApp.roundStarted);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories, dispatch]);

  const middleWidth = 3;

  if (roundStarted) {
    return <Redirect to="/master/questions" />;
  } else if (isLoading) {
    return <CenterLoader />;
  }

  return (
    <Container className="top-anxiety">
      <Logo center />
      <Row>
        <Col>
          <ItemListHeader>Categories</ItemListHeader>
        </Col>
        <Col xs={middleWidth}>
          <ItemListHeader style={{ textAlign: 'center' }}>Round {roundNo + 1}</ItemListHeader>
        </Col>
        <Col>
          <ItemListHeader>Selected Categories</ItemListHeader>
        </Col>
      </Row>
      <Row style={{ minHeight: '230px' }}>
        <Col>
          <ItemList
            items={categories}
            show="category"
            selectable
            reducer={['quizzMasterApp', 'selectedCategory']}
            dispatchAs="CATEGORIES"
          />
        </Col>
        <Col xs={middleWidth} className="button-stack">
          <Button
            disabled={
              selectedCategories.length >= 3 ||
              !selectedCategory ||
              !categories.includes(selectedCategory)
            }
            onClick={() => dispatch(selectCategory())}
          >
            Select category
          </Button>
          <Button
            disabled={!selectedCategory || !selectedCategories.includes(selectedCategory)}
            onClick={() => dispatch(deselectCategory())}
          >
            Deselect category
          </Button>
          <Button
            disabled={selectedCategories.length < 3}
            onClick={() => dispatch(confirmCategoriesAndContinue(code, selectedCategories))}
            className="center-stick-bottom start-round"
          >
            Start round
          </Button>
        </Col>
        <Col>
          <ItemList
            items={selectedCategories}
            show="category"
            selectable
            reducer={['quizzMasterApp', 'selectedCategory']}
            dispatchAs="CATEGORIES"
          />
        </Col>
      </Row>
      <Row>
        <Col />
        <Col xs={middleWidth} className="top-anxiety">
          {roundNo >= 1 ? (
            <Button className="secondary" onClick={() => dispatch(endQuizz(code))}>
              End Quizz
            </Button>
          ) : null}
        </Col>
        <Col />
      </Row>
    </Container>
  );
};

export default QMCategories;
