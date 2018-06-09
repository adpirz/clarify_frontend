import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { fonts } from '../PatternLibrary/constants';

const ReportHeading = styled.div`
  display: flex;
  align-items: center;
`;

const ReportTitle = styled.h4`
  display: inline-block;
  font-size: ${fonts.large}
`;

const Subheading = styled.h5`
  font-size: ${fonts.medium};
  opacity: .5;
`;

export default ({title, crumbs, subheading}) => {
  return (
    <ReportHeading>
      <div>
        <ReportTitle>{title}</ReportTitle>
        <Subheading>{subheading || null}</Subheading>
      </div>
      {_.map(crumbs, (c) => {
        return (
          <span key={c.query}>
            > {c.label}
          </span>
        );
      })}
    </ReportHeading>
  )
};