import React from "react";
import styled from "styled-components";
import map from "lodash/map";
import find from "lodash/find";
import filter from "lodash/filter";
import { Grid } from "semantic-ui-react";

import { PageRowPosedFactory, PagePosedFactory } from "./PatternLibrary/Posed";
import { DataConsumer } from "../DataProvider";
import { EmptyState } from "./PatternLibrary";
import ActionCardContainer from "./PatternLibrary/ActionCard/ActionCardContainer";

const RemindersDetailEmptyState = styled(EmptyState)`
  box-shadow: none;
  margin: auto auto;
`;

class Reminders extends React.Component {
  render() {
    const { getReminderActions, students, deltas, saveAction } = this.props;
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
                const deltasForStudent = filter(deltas, { student_id: a.student_id });
                return (
                  <ActionCardContainer
                    key={a.id}
                    action={a}
                    student={studentForAction}
                    deltas={deltasForStudent}
                    onSubmitAction={saveAction}
                  />
                );
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
    {({ deltas, getReminderActions, students, saveAction }) => (
      <Reminders
        deltas={deltas}
        getReminderActions={getReminderActions}
        students={students}
        saveAction={saveAction}
        {...props}
      />
    )}
  </DataConsumer>
);
