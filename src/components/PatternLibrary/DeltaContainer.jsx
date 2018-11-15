import React from "react";
import posed from "react-pose";
import styled from "styled-components";
import isSameDay from "date-fns/is_same_day";
import filter from "lodash/filter";

import { effects, colors, fontSizes } from "./constants";

const PosedContainer = posed.div({
  enter: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -30,
    opacity: 0,
  },
});

const Card = styled.div`
  margin: 15px;
  padding: 20px;
  width: 200px;
  height: 100px;
  box-shadow: ${effects.cardBoxShadow};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;

  cursor: ${({ onClick }) => {
    return onClick ? "pointer;" : "inherit;";
  }};
`;

const SelectedIconContainer = styled.span`
  border-radius: 50%;
  padding 10px;
  position: absolute;
  right: 15px;
  bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ isSelected }) => {
    return isSelected ? colors.googleBlue : colors.textGrey;
  }};

  opacity: ${({ isSelected }) => {
    return isSelected ? "1;" : ".2;";
  }};

  visibility: ${({ isSelectable }) => {
    return isSelectable ? "visible;" : "hidden;";
  }};

`;

const SelectedIcon = styled.i`
  font-size: ${fontSizes.large};
  color: ${colors.white};
`;

const Content = styled.span`
  display: block;
  font-size: ${fontSizes.large};
  color: ${({ improvement }) => {
    if (typeof improvement === "undefined") {
      return colors.black;
    } else if (improvement) {
      return colors.deltaGreen;
    } else {
      return colors.deltaRed;
    }
  }};
`;

class Delta extends React.Component {
  getNewMissingAssignmentsCount = delta => {
    const { created_on: deltaCreatedDate, missing_assignments: missingAssignments } = delta;
    return filter(missingAssignments, a => {
      return isSameDay(a.missing_on, deltaCreatedDate);
    }).length;
  };

  render() {
    const { delta, isSelectable, isSelected, handleDeltaClick } = this.props;

    let header = "";
    let content = null;
    let value = null;

    switch (delta.type) {
      case "missing":
        header = "Missing Assignments";
        value = this.getNewMissingAssignmentsCount(delta);
        content = (
          <Content improvement={value < 0}>
            {value < 0 ? <i className="fas fa-arrow-down" /> : <i className="fas fa-arrow-up" />}
            {value}
          </Content>
        );
        break;
      case "category":
        header = delta.score.assignment_name;
        value = Math.round((delta.category_average_after - delta.category_average_before) * 100);
        content = (
          <Content improvement={value > 0}>
            {value < 0 ? <i className="fas fa-arrow-down" /> : <i className="fas fa-arrow-up" />}
            {value}%
          </Content>
        );
        break;
      default:
        return;
    }

    return (
      <PosedContainer>
        <Card onClick={handleDeltaClick && handleDeltaClick.bind(this, delta.delta_id)}>
          <Content>{header}</Content>
          {content}
          <SelectedIconContainer isSelectable={isSelectable} isSelected={isSelected}>
            <SelectedIcon className="fas fa-check" />
          </SelectedIconContainer>
        </Card>
      </PosedContainer>
    );
  }
}

export default Delta;
