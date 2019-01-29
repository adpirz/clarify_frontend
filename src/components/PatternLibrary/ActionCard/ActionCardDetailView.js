import React from "react";
import capitalize from "lodash/capitalize";
import { Grid, Segment, List, Menu, Icon, Button, Ref, Header, Label } from "semantic-ui-react";
import styled from "styled-components";
import { format } from "date-fns";

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
  bottomMenuItems,
  contextCount,
  ...props
}) => {
  let iconName;
  if (action.type === "note") iconName = "sticky note";
  if (action.type === "call") iconName = "phone";
  if (action.type === "message") iconName = "chat";

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
        {bottomMenuItems &&
          bottomMenuItems.map((item, i) => <Menu.Item key={item.key || i}>{item}</Menu.Item>)}
      </Menu>
    </Segment>
  );
};

export default ActionCardDetailView;
