import React from "react";
import styled from "styled-components";
import isSameDay from "date-fns/is_same_day";
import format from "date-fns/format";
import filter from "lodash/filter";

import { colors, fontSizes } from "./constants";

const ContextCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${fontSizes.small};
  background-color: ${colors.white};
  margin: 5px 0px;
  padding: 0 10px;
  border-radius: 10px;
  width: 230px;
`;

const Content = styled.span`
  font-size: ${fontSizes.small};
  display: block;
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

const ContextDate = styled.span`
  font-size: ${fontSizes.xxsmall};
  white-space: nowrap;
  opacity: 0.5;
`;

const ContextIconContainer = styled.span`
  border-radius: 50%;
  padding 10px;
  margin: 10px 10px 10px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.textGrey};
`;

const ContextIcon = styled.i`
  font-size: ${fontSizes.large};
  color: ${colors.white};
`;

const ContextDetails = styled.section`
  width: 50%;
`;

class ContextDelta extends React.Component {
  getNewMissingAssignmentsCount = delta => {
    const { created_on: deltaCreatedDate, missing_assignments: missingAssignments } = delta;
    return filter(missingAssignments, a => {
      return isSameDay(a.missing_on, deltaCreatedDate);
    }).length;
  };

  handleHoverEnter = e => {
    e.stopPropagation();
    console.debug("bloop");
  };

  handleHoverLeave = e => {
    e.stopPropagation();
    console.debug("NO BLOOP");
  };

  render() {
    const { delta } = this.props;

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
      <ContextCard
        {...this.props}
        onMouseOver={this.handleHoverEnter}
        onMouseLeave={this.handleHoverLeave}
      >
        <ContextIconContainer>
          <ContextIcon className="fas fa-chart-line" />
        </ContextIconContainer>
        <ContextDetails>
          <Content>{header}</Content>
          <ContextDate>{format(delta.sort_date, "MMMM Do, YYYY")}</ContextDate>
        </ContextDetails>
        {content}
      </ContextCard>
    );
  }
}

export default ContextDelta;
