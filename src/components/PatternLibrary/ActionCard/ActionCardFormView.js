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

const ListOverflow = styled.div`
  max-height: 210px;
  overflow-y: scroll;
`;
/**
 * Accepts <DeltaCard listView/> as children
 */
const ActionCardFormView = ({
  action,
  contacts,
  actionFormType,
  onSelectActionFormType,
  actionFormTextValue,
  actionFormOnInput,
  actionFormDueOn,
  actionFormIsPublic,
  onPublicToggleClick,
  onDateChange,
  onSubmitAction,
  children,
  bottomMenuItems,
  contextCount,
  ...props
}) => {
  const disabled = !action && !actionFormType;

  let iconName;
  if (actionFormType === "note") iconName = "sticky note";
  if (actionFormType === "call") iconName = "phone";
  if (actionFormType === "message") iconName = "chat";

  return (
    <Segment basic {...props}>
      <Segment attached basic secondary style={{ minHeight: "270px" }}>
        <Grid divided>
          <Grid.Row>
            <Grid.Column computer={children ? 9 : 16}>
              {actionFormType && (
                <Header as="h3">
                  <Icon name={iconName} />
                  {capitalize(actionFormType)}
                </Header>
              )}
              {contacts && contactList(contacts)}
              {contacts && <Divider />}
              <Form as={Segment} basic>
                <TextArea
                  disabled={disabled}
                  value={actionFormTextValue}
                  onInput={actionFormOnInput}
                  style={{ minHeight: "150px" }}
                />
              </Form>
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
          <Button onClick={onSubmitAction}>Submit</Button>
        </Menu.Item>
        {bottomMenuItems.map((item, i) => (
          <Menu.Item key={item.key || i}>{item}</Menu.Item>
        ))}
        <Menu.Item>
          <Popup
            size="mini"
            position="top right"
            verticalOffset={9}
            trigger={
              <Radio
                disabled={disabled}
                toggle
                checked={actionFormIsPublic}
                onChange={onPublicToggleClick}
                label="Public"
              />
            }
          >
            <Popup.Content>
              <Segment basic>
                Toggles whether other people will be able to read this action.
                <Divider />
                <strong>
                  {actionFormIsPublic ? "Others can see this." : "Only you will see this."}
                </strong>
              </Segment>
            </Popup.Content>
          </Popup>
        </Menu.Item>
        <Menu.Item>
          <DateInput
            value={actionFormDueOn}
            onChange={onDateChange}
            placeholder="Remind me later..."
          />
          <Popup
            size="mini"
            position="top right"
            verticalOffset={9}
            trigger={
              <Icon style={{ paddingLeft: "0.3em" }} size="large" link name="question circle" />
            }
          >
            <Popup.Content>
              <Segment basic>
                Adding a date will turn this action into a reminder. It will go to your Reminders
                page to finish later.
                <Divider />
                <strong>
                  {actionFormDueOn
                    ? "This will go to your reminders."
                    : "This action will be considered complete (will not be reminded)."}
                </strong>
              </Segment>
            </Popup.Content>
          </Popup>
        </Menu.Item>
      </Menu>
    </Segment>
  );
};

export default ActionCardFormView;

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
