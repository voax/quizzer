import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-grid-system';

import Button from './Button';
import ItemList, { StaticItemList } from './ItemList';
import ItemListHeader from './ItemListHeader';
import {
  approveSelectedApplication,
  rejectSelectedApplication,
} from '../reducers/quizz-master-app';
import Logo from './Logo';

const QMTeams = () => {
  const dispatch = useDispatch();
  const code = useSelector(state => state.quizzMasterApp.roomCode);
  const teamApplications = useSelector(state => state.quizzMasterApp.teamApplications);
  const approvedTeamApplications = useSelector(
    state => state.quizzMasterApp.approvedTeamApplications
  );
  const selectedTeamApplication = useSelector(
    state => state.quizzMasterApp.selectedTeamApplication
  );

  const actionButtonsDisabled = !teamApplications.length || !selectedTeamApplication;

  return (
    <Container className="top-anxiety">
      <Row>
        <Col>
          Room code: <b>{code}</b>
        </Col>
      </Row>
      <Row>
        <Col>
          <ItemListHeader>Applied Teams</ItemListHeader>
        </Col>
        <Col xs={3}>
          <Logo fontSize="4em" center />
        </Col>
        <Col>
          <ItemListHeader>Approved Teams</ItemListHeader>
        </Col>
      </Row>
      <Row>
        <Col>
          <ItemList
            items={teamApplications}
            show="name"
            selectable
            reducer={['quizzMasterApp', 'selectedTeamApplication']}
            dispatchAs="APPLIED"
          />
        </Col>
        <Col xs={3} className="button-stack">
          <Button
            disabled={actionButtonsDisabled}
            onClick={() => dispatch(approveSelectedApplication())}
          >
            Approve team
          </Button>
          <Button
            disabled={actionButtonsDisabled}
            onClick={() => dispatch(rejectSelectedApplication())}
          >
            Reject team
          </Button>
        </Col>
        <Col>
          <StaticItemList items={approvedTeamApplications} show="name" />
        </Col>
      </Row>
    </Container>
  );
};

export default QMTeams;
