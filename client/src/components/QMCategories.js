import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-grid-system';

import Button from './Button';
import ItemList, { StaticItemList } from './ItemList';
import ItemListHeader from './ItemListHeader';
import { fetchCategories, selectCategory } from '../reducers/quizz-master-app';
import Loader from './Loader';
import Logo from './Logo';

const QMCategories = () => {
  const dispatch = useDispatch();
  const roundNo = useSelector(state => state.quizzMasterApp.round);
  const isLoading = useSelector(state => state.loader.active);
  const categories = useSelector(state => state.quizzMasterApp.categories);
  const selectedCategories = useSelector(state => state.quizzMasterApp.selectedCategories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories, dispatch]);

  const middleWidth = 3;

  if (isLoading) {
    return (
      <Container fluid className="full-screen center">
        <Row className="focus-center">
          <Col>
            <Loader />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="top-anxiety">
      <Logo center />
      <Row>
        <Col>
          <ItemListHeader>Categories</ItemListHeader>
        </Col>
        <Col xs={middleWidth}>
          <ItemListHeader style={{ textAlign: 'center' }}>Round {roundNo}</ItemListHeader>
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
            disabled={selectedCategories.length >= 3}
            onClick={() => dispatch(selectCategory())}
          >
            Select category
          </Button>
          <Button
            disabled={selectedCategories.length < 3}
            // onClick={() => dispatch(confirmCategoriesAndContinue())}
            className="center-stick-bottom start-round"
          >
            Start round
          </Button>
        </Col>
        <Col>
          <StaticItemList items={selectedCategories} show="category" />
        </Col>
      </Row>
    </Container>
  );
};

export default QMCategories;
