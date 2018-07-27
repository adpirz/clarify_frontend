import _ from 'lodash';
import styled from 'styled-components';
import React from 'react';
import { lighten } from 'polished';

import { ReportActions } from '../';
import { effects } from "../constants";

const Title = styled.span`
  font-weight: bold;
  font-size: 1.2em;
  padding-bottom: 3px;
`;

const Footer = styled.div`
  padding: 5px;
  font-size: 0.8em;
  font-style: italic;
  margin-top: 15px;
  color: ${lighten(.6, 'black')};
  border-top: 1px solid ${lighten(.8, 'black')};
  text-align:right;
`

const ReportSummaryContainerStyled = styled.div`
  display: inline-block;
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  min-height: 125px;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  cursor: pointer;
  box-shadow: ${effects.boxShadow};

  &:hover {
    box-shadow: ${effects.boxShadowHover};
  }
`;

const ReportSummaryContainer = props => {
  const {
    report,
    reportData,
    handleSelectReport,
    handleDeleteClick,
    handleSaveClick,
    handleShareClick,
    children,
  } = props;

  const { title } = reportData;
  const { shared_by, shared_with } = report;

  let footerNodes = [];
  if (shared_by) {
    footerNodes.push(<span key="shared_by">Shared by: {shared_by.staff}</span>)
  }
  if (shared_with && shared_with.length) {
    const sharedWithNames = _.map(shared_with, 'staff').join(', ');
    footerNodes.push((
      <span
        title={sharedWithNames}
        style={{opacity: '.5'}}
        key="shared_with"
      >
        Shared with {shared_with.length} educator{shared_with.length > 1 ? 's' : null}
      </span>
    ));
  }

  return (
    <ReportSummaryContainerStyled
        onClick={handleSelectReport}
        >
        <ReportActions
          handleDeleteClick={handleDeleteClick}
          handleSaveClick={handleSaveClick}
          handleShareClick={handleShareClick}
        />
        <Title>{title ? title : report.title}</Title>
        {children}
        {footerNodes.length ? <Footer>{footerNodes}</Footer> : null }
      </ReportSummaryContainerStyled>
  )
};

export default ReportSummaryContainer;
