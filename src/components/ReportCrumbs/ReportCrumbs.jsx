import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { Button } from '../PatternLibrary';
import { fonts } from '../PatternLibrary/constants';

const ReportTitle = styled.h4`
  display: inline-block;
  font-size: ${fonts.large}
`;

export default ({title, crumbs, popReportLevel}) => {
  return (
    <div>
      <ReportTitle>{title}</ReportTitle>
      {_.map(crumbs, (c) => {
        return (
          <span key={c.query}>
            > {c.label}
          </span>
        );
      })}
      {crumbs.length ? <Button onClick={popReportLevel}> Go Back </Button>: null}
    </div>
  )
};