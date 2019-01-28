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
} from "semantic-ui-react";
import styled from "styled-components";

import { ListItemPosedFactory } from "../Posed";

const ListOverflow = styled.div`
  max-height: 200px;
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
  ...props
}) => {
  const disabled = !action && !actionFormType;

  let iconName;
  if (actionFormType === "note") iconName = "sticky note";
  if (actionFormType === "call") iconName = "phone";
  if (actionFormType === "message") iconName = "chat";

  return (
    <Segment basic {...props}>
      <Segment attached basic secondary style={{ minHeight: "240px" }}>
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
                  <Header as="h3">Select Context for Note</Header>
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
        <Menu.Item as={ListItemPosedFactory()}>
          <Button onClick={onSubmitAction}>Submit</Button>
        </Menu.Item>
        {bottomMenuItems}
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
      </Menu>
    </Segment>
  );
};

export default ActionCardFormView;

function contactList(contacts) {
  return (
    <Segment basic>
      <List size="small" horizontal divided relaxed>
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
