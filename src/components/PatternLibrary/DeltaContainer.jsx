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
  width: 250px;
  box-shadow: ${effects.cardBoxShadow};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;

  cursor: ${({ onClick }) => {
    return onClick ? "pointer;" : "inherit;";
  }};
`;

const SelectedIconContainer = styled.span`
  border-radius: 50%;
  padding 10px;
  position: absolute;
  right: 25px;
  bottom: 25px;
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

const ContextContent = styled(Content)`
  font-size: ${fontSizes.small};
  text-overflow: ellipsis;
  overflow: hidden;
`;

const posedPopoverContent = posed.div({
  visible: {
    opacity: 1,
    delay: 700,
    transition: {
      duration: 200,
    },
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

const ContextCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${fontSizes.small};
  background-color: ${colors.white};
  margin: 10px;
  padding: 5px;
  border-radius: 10px;
  width: 300px;
  position: relative;
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
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

class DeltaContainer extends React.Component {
  state = {
    popoverPose: "hidden",
  };

  getNewMissingAssignments = delta => {
    const { created_on: deltaCreatedDate, missing_assignments: missingAssignments } = delta;
    return filter(missingAssignments, a => {
      return isSameDay(a.missing_on, deltaCreatedDate);
    });
  };

  handleMouseEvent = (pose, e) => {
    this.setState({ popoverPose: pose });
  };

  getDeltaValue = () => {
    const { delta } = this.props;
    if (delta.type === "missing") {
      const missingAssignments = this.getNewMissingAssignments(delta);
      return (
        <Content improvement={missingAssignments.length < 0}>
          {missingAssignments.length < 0 ? (
            <i className="fas fa-arrow-down" />
          ) : (
            <i className="fas fa-arrow-up" />
          )}
          {missingAssignments.length}
        </Content>
      );
    } else if (delta.type === "category") {
      const categoryChange = Math.round(
        (delta.category_average_after - delta.category_average_before) * 100
      );
      return (
        <Content improvement={categoryChange > 0}>
          {categoryChange < 0 ? (
            <i className="fas fa-arrow-down" />
          ) : (
            <i className="fas fa-arrow-up" />
          )}
          {categoryChange}%
        </Content>
      );
    }
    return null;
  };

  getPopoverContent = () => {
    const { delta } = this.props;
    if (delta.type === "missing") {
      const missingAssignments = this.getNewMissingAssignments(delta);
      return (
        <StyledPopoverContent pose={this.state.popoverPose}>
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
    } else if (delta.type === "category") {
      return (
        <StyledPopoverContent pose={this.state.popoverPose}>
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
    }
  };

  getHeader = () => {
    const { delta } = this.props;

    if (delta.type === "missing") {
      return "Missing Assignments";
    } else if (delta.type === "category") {
      return delta.context_record.category_name;
    }
    return null;
  };
}

class DeltaCard extends DeltaContainer {
  render() {
    const { delta, isSelectable, isSelected, handleDeltaClick } = this.props;

    return (
      <PosedContainer>
        <Card
          onClick={handleDeltaClick && handleDeltaClick.bind(this, delta.delta_id)}
          onMouseEnter={this.handleMouseEvent.bind(this, "visible")}
          onMouseLeave={this.handleMouseEvent.bind(this, "hidden")}
        >
          <Content>{this.getHeader()}</Content>
          {this.getDeltaValue()}
          <SelectedIconContainer isSelectable={isSelectable} isSelected={isSelected}>
            <SelectedIcon className="fas fa-check" />
          </SelectedIconContainer>
        </Card>
        {this.getPopoverContent()}
      </PosedContainer>
    );
  }
}

class ContextDelta extends DeltaContainer {
  render() {
    const { delta } = this.props;
    return (
      <PosedContainer>
        <ContextCard
          {...this.props}
          onMouseEnter={this.handleMouseEvent.bind(this, "visible")}
          onMouseLeave={this.handleMouseEvent.bind(this, "hidden")}
        >
          <ContextIconContainer>
            <ContextIcon className="fas fa-chart-line" />
          </ContextIconContainer>
          <ContextDetails>
            <ContextContent>{this.getHeader()}</ContextContent>
            <ContextDate>{format(delta.sort_date, "MMMM Do, YYYY")}</ContextDate>
          </ContextDetails>
          {this.getDeltaValue()}
        </ContextCard>
        {this.getPopoverContent()}
      </PosedContainer>
    );
  }
}

export { ContextDelta, DeltaCard };
