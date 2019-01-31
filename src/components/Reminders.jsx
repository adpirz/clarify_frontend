import React from "react";
import styled from "styled-components";
import map from "lodash/map";
import find from "lodash/find";
import filter from "lodash/filter";
import { Route } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { PageRowPosedFactory, PagePosedFactory } from "./PatternLibrary/Posed";

import { DataConsumer } from "../DataProvider";
import { ActionCard, EmptyState } from "./PatternLibrary";

const RemindersDetailEmptyState = styled(EmptyState)`
  box-shadow: none;
  margin: auto auto;
`;

class Reminders extends React.Component {
  render() {
    const { getReminderActions, students, deltas } = this.props;
    const actionReminders = getReminderActions();
    let mainContentBodyNode = null;
    if (!actionReminders || !actionReminders.length) {
      mainContentBodyNode = (
        <RemindersDetailEmptyState>
          <p>
            Here's where you'll find reminders for actions you want to remember to do later, but
            looks like you haven't created any yet{" "}
            <span role="img" aria-label="thinking">
              🤔
            </span>
          </p>
          <p>
            Pick a student on the left or head to the Next Steps page to find a student you haven't
            talked to in a while!
          </p>
        </RemindersDetailEmptyState>
      );
    } else {
      mainContentBodyNode = (
        <Grid as={PagePosedFactory()} container padded columns={1}>
          <Grid.Row as={PageRowPosedFactory()}>
            {/* Header for Home Page  */}
            <Grid.Column>
              {map(actionReminders, (a, i) => {
                const studentForAction = find(students, { id: a.student_id });
                const contextDeltas = filter(deltas, delta => {
                  return a.delta_ids.indexOf(delta.delta_id) > -1;
                });

                const ActionCardContainer = ({ location, history, match }) => {
                  const inEditMode = location.pathname.indexOf("edit") > -1;
                  const thisActionSelected = parseInt(match.params.actionID, 10) === a.id;

                  return (
                    <ActionCard
                      action={a}
                      contextDeltas={contextDeltas}
                      editRoute={`/reminders/action/${a.id}/edit`}
                      doneEditingRoute="/reminders"
                      push={history.push}
                      student={studentForAction}
                      reminderButtonCopy="Snooze"
                      inEditMode={thisActionSelected && inEditMode}
                      showTitle={true}
                      showContextSection={!!contextDeltas.length}
                      key={i}
                    />
                  );
                };

                return [
                  <Route
                    key="1"
                    path={this.props.match.url}
                    exact
                    component={ActionCardContainer}
                  />,
                  <Route
                    key="2"
                    path={`${this.props.match.url}/action/:actionID/edit`}
                    component={ActionCardContainer}
                  />,
                ];
              })}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }

    return <div>{mainContentBodyNode}</div>;
  }
}

export default props => (
  <DataConsumer>
    {({ deltas, getReminderActions, students }) => (
      <Reminders
        deltas={deltas}
        getReminderActions={getReminderActions}
        students={students}
        {...props}
      />
    )}
  </DataConsumer>
);
