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
}) => {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Button onClick={deselectReport} style={{display: 'inline-block'}}>
        <i className="fas fa-share" style={{transform: "scaleX(-1)"}} />
      </Button>
      <div>
        <ReportTitle>{title}</ReportTitle>
        <Subheading>{subheading || null}</Subheading>
      </div>
      <ReportActions
        handleDeleteClick={handleDeleteClick}
        handleSaveClick={handleSaveClick}
        handleShareClick={handleShareClick}
      />
      {_.map(crumbs, (c) => {
        return (
          <span key={c.query}>
            > {c.label}
          </span>
        );
      })}
    </div>
  )
};