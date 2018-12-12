import React from "react";
import styled from "styled-components";
import map from "lodash/map";
import find from "lodash/find";
import filter from "lodash/filter";
import { DataConsumer } from "../DataProvider";

import { MainContentBody, ActionCard, EmptyState, PageHeading } from "./PatternLibrary";

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
        <MainContentBody>
          {map(actionReminders, (a, i) => {
            const studentForAction = find(students, { id: a.student_id });
            const contextDeltas = filter(deltas, delta => {
              return a.delta_ids.indexOf(delta.delta_id) > -1;
            });

            const inEditMode = this.props.location.pathname.indexOf("edit") > -1;
            const thisActionSelected = parseInt(this.props.match.params.actionID, 10) === a.id;

            return (
              <ActionCard
                action={a}
                contextDeltas={contextDeltas}
                editRoute={`/reminders/action/${a.id}/edit`}
                doneEditingRoute="/reminders"
                push={this.props.history.push}
                student={studentForAction}
                reminderButtonCopy="Snooze"
                inEditMode={thisActionSelected && inEditMode}
                showTitle={true}
                showContextSection={!!contextDeltas.length}
                key={i}
              />
            );
          })}
        </MainContentBody>
      );
    }

    return (
      <div>
        <PageHeading />
        {mainContentBodyNode}
      </div>
    );
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
