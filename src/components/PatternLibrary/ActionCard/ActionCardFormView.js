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
  Responsive,
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
  toggleRemind,
  children,
  menuItemsPrimary,
  menuItemsSecondary,
  contextCount,
  remindSelected,
  ...props
}) => {
  const disabled = !actionFormType;

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
              {iconName && (
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
      <Menu borderless attached="bottom">
        {menuItemsPrimary &&
          menuItemsPrimary.map((item, i) => <Menu.Item key={item.key || i}>{item}</Menu.Item>)}
        <Menu.Item>
          {remindSelected ? (
            <DateInput
              value={actionFormDueOn}
              dateFormat="YYYY-MM-DDTHH:MM:SS"
              minDate={new Date()}
              onChange={onDateChange}
              placeholder="Remind me later..."
              onClear={toggleRemind}
            />
          ) : (
            <Button.Group>
              <Button onClick={onSubmitAction.bind(this, { completed: true })}>Submit</Button>
              <Button.Or />
              <Button onClick={toggleRemind}>Remind Me Later</Button>
            </Button.Group>
          )}
          {remindSelected && [
            <Button
              key="remnd"
              onClick={onSubmitAction.bind(this, { completed: false })}
              style={{ marginLeft: "0.5em" }}
            >
              Remind Me
            </Button>,
            <Button key="cancel" onClick={toggleRemind} style={{ marginLeft: "0.5em" }}>
              Cancel
            </Button>,
          ]}
        </Menu.Item>
        {menuItemsSecondary &&
          menuItemsSecondary.length &&
          menuItemsSecondary.map((item, i) => <Menu.Item key={item.key || i}>{item}</Menu.Item>)}
        <Menu.Item>
          <Radio
            disabled={disabled}
            toggle
            checked={actionFormIsPublic}
            onChange={onPublicToggleClick}
            label="Public"
          />
        </Menu.Item>
        <Responsive as={Menu.Item} disabled minWidth={Responsive.onlyLargeScreen.minWidth}>
          {actionFormIsPublic ? "Visible to others." : "Only visible to you."}
        </Responsive>
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
