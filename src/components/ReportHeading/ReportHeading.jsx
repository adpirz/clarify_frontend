import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { ReportActions, Button } from '../PatternLibrary'
import { fonts } from '../PatternLibrary/constants';

const ReportTitle = styled.h4`
  display: inline-block;
  font-size: ${fonts.large};
  margin: 0;
`;

const Subheading = styled.h5`
  font-size: ${fonts.medium};
  opacity: .5;
  margin: 0;
`;

export default ({
  title,
  crumbs,
  subheading,
  deselectReport,
  handleSaveClick,
  handleDeleteClick,
  handleShareClick,
  handlePopReportLevel,
}) => {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
      <Button onClick={deselectReport} style={{display: 'inline-block'}}>
        Back to worksheet
      </Button>
      <div style={{flexGrow:"1", textAlign:"center"}}>
        <ReportTitle>{title}</ReportTitle>
        {subheading ? <Subheading>{subheading}</Subheading> : null}
        {_.map(crumbs, (c) => {
          return (
            <span key={c.query}>
              &nbsp;>&nbsp;{c.label}
            </span>
          );
        })}
      </div>
      <ReportActions
        handleDeleteClick={handleDeleteClick}
        handleSaveClick={handleSaveClick}
        handleShareClick={handleShareClick}
        handlePopReportLevel={handlePopReportLevel}
      />
    </div>
  )
};