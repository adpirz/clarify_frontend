import React from "react";
import posed from "react-pose";
import styled from "styled-components";
import isSameDay from "date-fns/is_same_day";
import format from "date-fns/format";
import filter from "lodash/filter";
import map from "lodash/map";

import { effects, colors, fontSizes } from "./constants";

const PosedContainer = styled(
  posed.div({
    enter: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -30,
      opacity: 0,
    },
  })
)`
  position: relative;
`;

const Card = styled.div`
  margin: 15px;
  padding: 20px;
  height: 100px;
  box-shadow: ${effects.cardBoxShadow};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
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
  font-size: ${fontSizes.medium};
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

const posedPopoverContent = posed.div({
  visible: {
    opacity: 1,
  },
  hidden: { opacity: 0 },
});

const StyledPopoverContent = styled(posedPopoverContent)`
  position: absolute;
  min-width: 250px;
  min-height: 50px;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  font-size: ${fontSizes.small};
  background-color: ${colors.backgroundGrey};
  box-shadow: ${effects.cardBoxShadow};
  padding: 10px;
`;

const PopoverCaret = styled.div`
  position: absolute;
  top: -25px;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 25px solid ${colors.backgroundGrey};
`;

const CategoryGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
`;

const AssignmentGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 1fr;
`;

const ContextHeading = styled.span`
  font-weight: bold;
  font-size: ${fontSizes.xsmall};
  margin-bottom: 10px;
`;

const ContextRecord = styled.span`
  font-size: ${fontSizes.xsmall};
`;

class Delta extends React.Component {
  state = {
    pose: "hidden",
  };

  getNewMissingAssignments = delta => {
    const { created_on: deltaCreatedDate, missing_assignments: missingAssignments } = delta;
    return filter(missingAssignments, a => {
      return isSameDay(a.missing_on, deltaCreatedDate);
    });
  };

  handleMouseEvent = (pose, e) => {
    this.setState({ pose });
  };

  render() {
    const { delta, isSelectable, isSelected, handleDeltaClick } = this.props;

    let header = "";
    let content = null;
    let popoverContent = null;

    switch (delta.type) {
      case "missing":
        header = "Missing Assignments";
        const missingAssignments = this.getNewMissingAssignments(delta);
        content = (
          <Content improvement={missingAssignments.length < 0}>
            {missingAssignments.length < 0 ? (
              <i className="fas fa-arrow-down" />
            ) : (
              <i className="fas fa-arrow-up" />
            )}
            {missingAssignments.length}
          </Content>
        );
        popoverContent = (
          <StyledPopoverContent pose={this.state.pose}>
            <AssignmentGrid>
              <ContextHeading>Assignment Name</ContextHeading>
              <ContextHeading>Due</ContextHeading>
              {map(missingAssignments, (a, i) => {
                return [
                  <ContextRecord key={1}>{a.assignment_name}</ContextRecord>,
                  <ContextRecord key={2}>{format(a.due_date, "MM/DD")}</ContextRecord>,
                ];
              })}
            </AssignmentGrid>
            <PopoverCaret />
          </StyledPopoverContent>
        );
        break;
      case "category":
        header = delta.context_record.category_name;
        const categoryChange = Math.round(
          (delta.category_average_after - delta.category_average_before) * 100
        );
        content = (
          <Content improvement={categoryChange > 0}>
            {categoryChange < 0 ? (
              <i className="fas fa-arrow-down" />
            ) : (
              <i className="fas fa-arrow-up" />
            )}
            {categoryChange}%
          </Content>
        );
        popoverContent = (
          <StyledPopoverContent pose={this.state.pose}>
            <CategoryGrid>
              <ContextHeading>Assignment Name</ContextHeading>
              <ContextHeading>Due</ContextHeading>
              <ContextHeading>%</ContextHeading>
              <ContextRecord>{delta.score.assignment_name}</ContextRecord>
              <ContextRecord>{format(delta.score.due_date, "MM/DD")}</ContextRecord>
              <ContextRecord>
                {Math.round((delta.score.score / delta.score.possible_points) * 100)}
              </ContextRecord>
            </CategoryGrid>
            <PopoverCaret />
          </StyledPopoverContent>
        );
        break;
      default:
        return;
    }

    return (
      <PosedContainer
        onMouseEnter={this.handleMouseEvent.bind(this, "visible")}
        onMouseLeave={this.handleMouseEvent.bind(this, "hidden")}
      >
        <Card onClick={handleDeltaClick && handleDeltaClick.bind(this, delta.delta_id)}>
          <Content>{header}</Content>
          {content}
          <SelectedIconContainer isSelectable={isSelectable} isSelected={isSelected}>
            <SelectedIcon className="fas fa-check" />
          </SelectedIconContainer>
        </Card>
        {popoverContent}
      </PosedContainer>
    );
  }
}

export default Delta;
