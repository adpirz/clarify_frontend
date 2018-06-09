import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { Button } from '../PatternLibrary';
import { fonts } from '../PatternLibrary/constants';

const ReportCrumbs = styled.div`
  display: flex;
  align-items: center;
`;

const ReportTitle = styled.h4`
  display: inline-block;
  font-size: ${fonts.large}
`;

export default ({title, crumbs, popReportLevel, deselectReport}) => {
  return (
    <ReportCrumbs>
      <ReportTitle>{title}</ReportTitle>
      {_.map(crumbs, (c) => {
        return (
          <span key={c.query}>
            > {c.label}
          </span>
        );
      })}
      {crumbs.length ?
        <Button onClick={popReportLevel} style={{marginLeft: 'auto'}}> Go Back </Button>
        : <Button onClick={deselectReport} style={{marginLeft: 'auto'}}> Return to Worksheet </Button>
      }
    </ReportCrumbs>
  )
};