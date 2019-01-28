import React from "react";
import { Popup, List, Icon, Label } from "semantic-ui-react";
import { processCategory } from ".";
import { ListItemPosedFactory } from "../Posed";

import DeltaCard from "./DeltaCardSummaryView";

/**
 * @todo implement missing assignments
 */
const DeltaCardListView = ({ delta, active, onSelect, popupRef, ...props }) => {
  const {
    deltaID,
    formattedAverageAfter,
    categoryName,
    statColor,
    studentCategoryChange,
    assignmentName,
    icon,
  } = processCategory(delta, true);

  const ListItem = (
    <List.Item
      onClick={onSelect}
      active={active}
      as={ListItemPosedFactory()}
      key={deltaID}
      {...props}
    >
      {active && (
        <List.Content verticalAlign="middle" floated="right">
          <Icon name="circle check" color="teal" size="large" />
        </List.Content>
      )}

      <Icon name={icon} size="large" label={formattedAverageAfter} color={statColor} />
      <List.Content verticalAlign="middle">
        <List.Header>{categoryName}</List.Header>
        <List.Description>
          <Label>
            {studentCategoryChange > 0 ? "Up" : "Down"} {Math.abs(studentCategoryChange)}% to{" "}
            {formattedAverageAfter}%
          </Label>
        </List.Description>
        <List.Description>Latest: {assignmentName}</List.Description>
      </List.Content>
    </List.Item>
  );
  return (
    <Popup
      trigger={ListItem}
      hoverable
      basic
      position="left center"
      delta={delta}
      content={<DeltaCard delta={delta} />}
      context={popupRef}
    />
  );
};

export default DeltaCardListView;
