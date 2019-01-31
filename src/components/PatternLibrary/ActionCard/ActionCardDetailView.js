import React from "react";
import map from "lodash/map";
import capitalize from "lodash/capitalize";
import {
  Grid,
  Segment,
  List,
  Menu,
  Icon,
  Divider,
  Form,
  TextArea,
  Button,
  Popup,
  Radio,
  Ref,
  Header,
  Label,
} from "semantic-ui-react";
import { DateInput } from "semantic-ui-calendar-react";
import styled from "styled-components";
import { format } from "date-fns";

import { ListItemPosedFactory } from "../Posed";

const ListOverflow = styled.div`
  max-height: 210px;
  overflow-y: scroll;
`;
/**
 * Accepts <DeltaCard listView/> as children
 */
const ActionCardDetailView = ({
  action,
  actionFormType,
  actionFormTextValue,
  actionFormDueOn,
  actionFormIsPublic,
  children,
  menuItemsSecondary,
  contextCount,
  ...props
}) => {
  const disabled = !action && !actionFormType;

  let iconName;
  if (action.type === "note") iconName = "sticky note";
  if (action.type === "call") iconName = "phone";
  if (action.type === "message") iconName = "chat";
  debugger;
  return (
    <Segment basic {...props}>
      <Segment attached basic secondary style={{ minHeight: "270px" }}>
        <Grid divided>
          <Grid.Row>
            <Grid.Column computer={children ? 9 : 16}>
              {action.type && (
                <Header as="h3">
                  <Icon name={iconName} />
                  {capitalize(action.type)} on {format(action.completed_on, "MMM, D, YYYY")}
                </Header>
              )}
              <h4>{action.note}</h4>
            </Grid.Column>
            {children && (
              <Ref innerRef={props.setRef}>
                <Grid.Column key="col2" computer={7}>
                  {/* 
                  TODO: Implement search
                  <Menu stackable secondary>
                    <Menu.Item>
                      <Input icon="search" placeholder="Search for context..." />
                    </Menu.Item>
                  </Menu> */}
                  <Header as="h3">
                    Select Context for Note
                    {contextCount > 0 && (
                      <Label size="small" color="teal">
                        {contextCount}
                      </Label>
                    )}
                  </Header>
                  <List as={ListOverflow} selection relaxed="very" divided>
                    {children}
                  </List>
                </Grid.Column>
              </Ref>
            )}
          </Grid.Row>
        </Grid>
      </Segment>
      <Menu attached="bottom">
        <Menu.Item>
          <Button disabled>Edit</Button>
        </Menu.Item>
        {menuItemsSecondary &&
          menuItemsSecondary.map((item, i) => <Menu.Item key={item.key || i}>{item}</Menu.Item>)}
      </Menu>
    </Segment>
  );
};

export default ActionCardDetailView;

function contactList(contacts) {
  return (
    <Segment basic>
      <List size="small" horizontal celled relaxed>
        {map(contacts, (contact, i) => (
          <List.Item key={i}>
            <List.Content>
              <List.Header>{contact.label}</List.Header>
              {contact.info}
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Segment>
  );
}
