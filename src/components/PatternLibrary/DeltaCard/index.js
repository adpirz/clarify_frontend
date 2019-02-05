import React from "react";
import { List, Statistic, Icon, Label, Popup, Divider } from "semantic-ui-react";
import map from "lodash/map";
import truncate from "lodash/truncate";
import { format, distanceInWordsStrict } from "date-fns";
import styled from "styled-components";

import SummaryView from "./DeltaCardSummaryView";
import DetailView from "./DeltaCardDetailView";
import ListView from "./DeltaCardListView";

const DeltaCard = ({ delta, listView, detailView, ...props }) => {
  if (listView) return <ListView delta={delta} {...props} />;
  if (detailView) return <DetailView delta={delta} {...props} />;
  return <SummaryView delta={delta} {...props} />;
};

export default DeltaCard;

export { ListView as DeltaCardListView };

const LighterTextSpan = styled.span`
  &&& {
    color: rgba(0, 0, 0, 0.3);
  }
`;

export function processCategory(delta, listViewData) {
  const {
    delta_id: deltaID,
    gradebook_name: gradebookName,
    category_average_before: categoryAverageBefore,
    category_average_after: categoryAverageAfter,
    sort_date: sortDate,
    context_record: {
      category_name: categoryName,
      total_points_possible: totalPointsPossible,
      average_points_earned: averagePointsEarned,
    },
    score: { score, assignment_name: assignmentName, possible_points: possiblePoints },
  } = delta;

  const studentCategoryChange = Math.round((categoryAverageAfter - categoryAverageBefore) * 100);
  const formattedAverageAfter = Math.round(categoryAverageAfter * 100);
  const averageClassPercentage = Math.round((averagePointsEarned / totalPointsPossible) * 100);

  const statColor = studentCategoryChange < 0 ? "red" : "green";
  const icon = studentCategoryChange < 0 ? "caret down" : "caret up";

  const latestAssignmentScoreFormatted = Math.round((score / possiblePoints) * 100);

  const timestamp = distanceInWordsStrict(new Date(sortDate), new Date()) + " ago";

  if (listViewData) {
    return {
      deltaID,
      formattedAverageAfter,
      categoryName,
      statColor,
      studentCategoryChange,
      assignmentName,
      icon,
    };
  }

  let classAverageComparator;
  if (formattedAverageAfter > averageClassPercentage) {
    classAverageComparator = "above";
  } else if (formattedAverageAfter < averageClassPercentage) {
    classAverageComparator = "below";
  } else {
    classAverageComparator = "equal to";
  }

  // Isolate the popup so we can play around
  // with the trigger, which the popup needs
  // to wrap

  const helperPopup = trigger => (
    <Popup wide position="top center" trigger={trigger}>
      <Popup.Content>
        <p>
          This student's average for the gradebook category <strong>{categoryName}</strong> went{" "}
          <br />
          <strong>
            {studentCategoryChange < 0 ? "down" : "up"} by {Math.abs(studentCategoryChange)}% to{" "}
            {formattedAverageAfter}%{" "}
          </strong>
          after turning in the assignment <strong>{assignmentName}</strong> with a grade of{" "}
          <strong>{latestAssignmentScoreFormatted}%</strong>.
        </p>
        <Divider />
        <p>
          <span>
            The student's average for this category is{" "}
            <strong>{classAverageComparator} the class average.</strong>
          </span>
        </p>
      </Popup.Content>
    </Popup>
  );

  const cardHeader = truncate(categoryName, { length: 24 });
  const cardMeta = truncate(gradebookName, { length: 28 });

  const cardDescription = (
    <div>
      <Statistic size="small" color={statColor}>
        <Statistic.Label>Category Avg.</Statistic.Label>
        <Statistic.Value>{formattedAverageAfter}%</Statistic.Value>
        <Statistic.Label>
          <Icon color={statColor} name={icon} />
          {Math.abs(studentCategoryChange)}%
        </Statistic.Label>
      </Statistic>

      <p>Class Avg: {averageClassPercentage}%</p>
      <p>
        <LighterTextSpan>Latest:</LighterTextSpan>{" "}
        <strong>{truncate(assignmentName, { length: 23 })}</strong> (
        {latestAssignmentScoreFormatted}%)
      </p>
    </div>
  );

  const cardExtra = (
    <div>
      <div>{timestamp}</div>
    </div>
  );
  return {
    cardHeader,
    cardMeta,
    cardDescription,
    cardExtra,
    helperPopup,
  };
}

export function processMissing(delta) {
  const { missing_assignments: missingAssignments } = delta;
  const n = missingAssignments ? missingAssignments.length : 0;
  const cardHeader = `Missing Assignments: ${n}`;
  const fullAssignmentList = missingAssignmentsList(missingAssignments);

  const needsToTruncate = missingAssignments.length > 5;

  let cardDescription;

  if (needsToTruncate) {
    const truncatedList = (
      <div>
        {missingAssignmentsList(missingAssignments.slice(0, 5))}
        <p>and {n - 5} more</p>
        <Label attached="bottom">Hover for more</Label>
      </div>
    );
    cardDescription = (
      <Popup trigger={truncatedList}>
        <Label attached="top" size="large">
          Full list
        </Label>
        <Popup.Content>{fullAssignmentList}</Popup.Content>
      </Popup>
    );
  } else {
    cardDescription = fullAssignmentList;
  }

  return {
    cardHeader,
    cardDescription,
  };
}

export function missingAssignmentsList(missingAssignments) {
  return (
    <List>
      {map(missingAssignments, ma => (
        <List.Item key={ma.assignment_id}>
          <List.Content>
            <List.Header>{ma.assignment_name}</List.Header>
            <List.Description>Due on {format(ma.due_date, "MMM, D")}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
}
