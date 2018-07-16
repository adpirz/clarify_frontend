import styled from 'styled-components';
import { darken } from 'polished';
import React from 'react';
import PropTypes from 'prop-types';

import {
  fonts,
  colors,
} from '../../PatternLibrary/constants';


const ActionIcon = styled.i`
  color: ${(props) => {return props.color}};
  font-size: ${fonts.large};
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    color: ${(props) => {return darken(.1, props.color)}};
  }
`;

const ActionIconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const propTypes = {
  handleSaveClick: PropTypes.func,
  handleShareClick: PropTypes.func,
  handleDeleteClick: PropTypes.func,
  handlePopReportLevel: PropTypes.func,
};

const ReportActions = ({
  handleSaveClick,
  handleShareClick,
  handleDeleteClick,
  handlePopReportLevel,
}) => {
  const actions = [];

  if (handlePopReportLevel) {
    actions.push((
      <ActionIcon
        key="pop"
        className="fas fa-share"
        color={colors.black}
        style={{transform: "scaleX(-1)"}}
        onClick={handlePopReportLevel}
      />
    ));
  }

  if (handleSaveClick) {
    actions.push((
      <ActionIcon
        key="save"
        className="fas fa-save"
        color={colors.primaryGreen}
        onClick={handleSaveClick}
      />
    ));
  }

  if (handleShareClick) {
    actions.push((
      <ActionIcon
        key="share"
        className="fas fa-share"
        color={colors.mainTheme}
        onClick={handleShareClick}
      />
    ));
  }

  if (handleDeleteClick) {
    actions.push((
      <ActionIcon
        key="delete"
        className="fas fa-times"
        color={colors.warningRed}
        onClick={handleDeleteClick}
      />
    ));
  }

  return (
    <ActionIconContainer>
      {actions}
    </ActionIconContainer>
  );
};

ReportActions.propTypes = propTypes;

export default ReportActions;