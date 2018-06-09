import _ from 'lodash';
import { darken } from 'polished';
import styled from 'styled-components';
import React from 'react';

import {
  colors,
  effects,
  fonts,
 } from '../PatternLibrary/constants';

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  box-shadow: ${effects.boxShadow};
  margin: 20px;
  cursor: pointer;

  &:hover {
    background: ${darken(.05, colors.white)};
    box-shadow: ${effects.boxShadowHover};
  }
`;

const CardLabel = styled.h2`
  display: inline-block;
  width: 30%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const MeasuresContainer = styled.div`
  font-size: ${fonts.large};
  display: flex;
`;

const MeasureLabel = styled.span`
  color: ${colors.primaryGreen};
`;

const Measure = styled.span`
  margin: 0 10px;
  display: inline-block;
`;

const RightCaret = styled.i`
  font-size: ${fonts.gargantuan};
  color: ${colors.greyBackground};

  &:hover {
    color: ${darken(.05, colors.greyBackground)};
  }
`;

class ReportCard extends React.Component {
  handleCardSelection = () => {
    const {
      id: depthId,
      depth,
      selectCard,
      label,
    } = this.props;

    selectCard(depth, depthId, label);
  }

  render() {
    const { label, measures } = this.props;
    return (
      <CardContainer
        onClick={this.handleCardSelection}
      >
        <CardLabel>{label}</CardLabel>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
          <MeasuresContainer>
            {_.map(measures, (m) => {
              return (
                <div key={m.measure_label}>
                  <MeasureLabel>
                    {m.measure_label}:
                  </MeasureLabel>
                  <Measure>
                    {m.measure}
                  </Measure>
                </div>
              );
            })}
          </MeasuresContainer>
          <RightCaret className="fas fa-caret-right" />
        </div>
      </CardContainer>
    );
  }
}


export default ReportCard;