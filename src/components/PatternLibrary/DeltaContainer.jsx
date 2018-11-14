import React from "react";
import posed from "react-pose";
import styled from "styled-components";
import isSameDay from "date-fns/is_same_day";
import filter from "lodash/filter";

import { effects, colors } from "./constants";

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
  padding: 15px;
  box-shadow: ${effects.cardBoxShadow};
`;

const Content = styled.span`
  display: block;
`;

const Statistic = styled.span`
  font-weight: bold;
`;

class Delta extends React.Component {
  getNewMissingAssignmentsCount = delta => {
    const { created_on: deltaCreatedDate, missing_assignments: missingAssignments } = delta;
    return filter(missingAssignments, a => {
      return isSameDay(a.missing_on, deltaCreatedDate);
    }).length;
  };

  render() {
    const { delta } = this.props;

    let header = "";
    let meta = "";
    let value = null;
    let color = null;
    let content = null;
    let extra = null;

    switch (delta.type) {
      case "missing":
        header = "Missing Assignment";
        meta = delta.gradebook_name;
        value = this.getNewMissingAssignmentsCount(delta);
        color = value > 0 ? colors.deltaRed : colors.deltaGreen;
        content = (
          <div>
            {delta.missing_assignments.map(ma => (
              <div key={ma.assignment_id}>
                <p>{ma.assignment_name}</p>
              </div>
            ))}
          </div>
        );
        break;
      case "category":
        header = delta.gradebook_name;
        meta = delta.context_record.category_name;
        value = Math.round((delta.category_average_after - delta.category_average_before) * 100);
        color = value > 0 ? "green" : "red";
        extra = (
          <div>
            <p>Student's Current Average: {Math.round(delta.category_average_after * 100)}</p>
            <p>
              Class Average at this point:{" "}
              {Math.round(
                (delta.context_record.average_points_earned /
                  delta.context_record.total_points_possible) *
                  100
              )}
            </p>
          </div>
        );
        content = (
          <div>
            <p>Last Assignment: {delta.last_assignment}</p>
            <p>
              Score: {delta.last_assignment_score} / {delta.last_assignment_points}
            </p>
          </div>
        );
        break;
      default:
        return;
    }

    return (
      <PosedContainer>
        <Card>
          <Content header={header} meta={meta} />
          <Content style={{ textAlign: "center" }}>
            <Statistic value={value} color={color} />
            <p>{delta.sort_date}</p>
          </Content>
          <Content>{content}</Content>
          <Content>{extra}</Content>
        </Card>
      </PosedContainer>
    );
  }
}

export default Delta;
