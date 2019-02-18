import React from "react";
import { Popup, List, Icon, Label } from "semantic-ui-react";
import { processCategory } from ".";
import { ListItemPosedFactory } from "../Posed";

import DeltaCard from "./DeltaCardSummaryView";

const CategoryListItemContents = ({ delta }) => {
  const {
    formattedAverageAfter,
    categoryName,
    statColor,
    studentCategoryChange,
    assignmentName,
    icon,
  } = processCategory(delta, true);

  return [
    <Icon key="icon" name={icon} size="large" label={formattedAverageAfter} color={statColor} />,
    <List.Content key="content" verticalAlign="middle">
      <List.Header>{categoryName}</List.Header>
      <List.Description>
        <Label>
          {studentCategoryChange > 0 ? "Up" : "Down"} {Math.abs(studentCategoryChange)}% to{" "}
          {formattedAverageAfter}%
        </Label>
      </List.Description>
      <List.Description>Latest: {assignmentName}</List.Description>
    </List.Content>,
  ];
};

const MissingListItemContents = ({ delta }) => {
  const missingAssignmentCount = delta.missing_assignments.length;
  return (
    <List.Content verticalAlign="middle" key={delta.id}>
      <List.Header>{missingAssignmentCount} missing assignments</List.Header>
    </List.Content>
  );
};

const DeltaCardListView = ({ delta, active, onSelect, popupRef, ...props }) => {
  const ListItem = (
    <List.Item
      onClick={onSelect}
      active={active}
      as={ListItemPosedFactory()}
      key={delta.id}
      {...props}
    >
      {active && (
        <List.Content verticalAlign="middle" floated="right">
          <Icon name="circle check" color="teal" size="large" />
        </List.Content>
      )}
      {delta.type === "missing" ? (
        <MissingListItemContents delta={delta} />
      ) : (
        <CategoryListItemContents delta={delta} />
      )}
    </List.Item>
  );
  return (
    // Use "style" prop as that's the semantic way to customize popups
    // without breaking other styles, hence not using as={styledComponent};
    // Style here is used to remove box-shadow which flickers when cycling
    // over list cards
    <Popup
      trigger={ListItem}
      hoverable
      basic
      position="left center"
      delta={delta}
      content={<DeltaCard raised={false} delta={delta} showHelper={false} />}
      context={popupRef}
      style={{
        boxShadow: "none",
      }}
    />
  );
};

export default DeltaCardListView;
