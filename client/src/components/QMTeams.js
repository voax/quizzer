import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-grid-system';

import Button from './Button';
import ItemList, { StaticItemList } from './ItemList';
import ItemListHeader from './ItemListHeader';
import {
  approveSelectedApplication,
  rejectSelectedApplication,
  confirmTeamsAndContinue,
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
  const teamsConfirmed = useSelector(state => state.quizzMasterApp.teamsConfirmed);

  const actionButtonsDisabled =
    !teamApplications.length || !selectedTeamApplication || teamsConfirmed;
  const middleWidth = 3;

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
        <Col xs={middleWidth}>
          <Logo fontSize="4em" center />
        </Col>
        <Col>
          <ItemListHeader>Approved Teams</ItemListHeader>
        </Col>
      </Row>
      <Row style={{ minHeight: '230px' }}>
        <Col>
          <ItemList
            items={teamApplications}
            show="name"
            selectable
            reducer={['quizzMasterApp', 'selectedTeamApplication']}
            dispatchAs="APPLIED"
          />
        </Col>
        <Col xs={middleWidth} className="button-stack">
          <Button
            disabled={actionButtonsDisabled || approvedTeamApplications.length >= 6}
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
          <Button
            disabled={
              approvedTeamApplications.length < 2 ||
              approveSelectedApplication.length >= 6 ||
              teamsConfirmed
            }
            onClick={() => dispatch(confirmTeamsAndContinue())}
            className="center-stick-bottom"
          >
            Next
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
