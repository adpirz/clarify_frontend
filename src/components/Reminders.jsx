import React from 'react';
import styled from 'styled-components';
import map from 'lodash/map';
import find from 'lodash/find';
import { DataConsumer } from '../DataProvider';

import {
  MainContentBody,
  ActionCard,
  EmptyState,
  PageHeading,
} from './PatternLibrary';


const RemindersDetailEmptyState = styled(EmptyState)`
  box-shadow: none;
  margin: auto auto;
`;

class Reminders extends React.Component {
  getRemindersOrEmptyState = () => {
    return (
      <RemindersDetailEmptyState>
        <p>
          Here's where you'll find reminders for actions you want to remember to do later. Looks like you haven't created any yet <span role="img" aria-label="thinking">🤔</span>
        </p>
        <p>
          Pick a student from the left or head to the home page to find a student you haven't talked to in a while!
        </p>
      </RemindersDetailEmptyState>
    )
  }

  render() {
    const { getReminderActions, saveAction, deleteAction, students } = this.props;
    const actionReminders = getReminderActions();

    if (!actionReminders || !actionReminders.length) {
      return (
        <RemindersDetailEmptyState>
          <p>
            Here's where you'll find reminders for actions you want to remember to do later, but looks like you haven't created any yet <span role="img" aria-label="thinking">🤔</span>
          </p>
          <p>
            Pick a student from the navigation over there <span role="img" aria-label="thinking">👈</span>, or head to the home page to find a student you haven't talked to in a while!
          </p>
        </RemindersDetailEmptyState>
      )
    }

    return (
      <div>
        <PageHeading />
        <MainContentBody>
          {map(actionReminders, (a, i) => {
            const studentForAction = find(students, {id: a.student_id});
            return (
              <ActionCard
                action={a}
                saveAction={saveAction}
                deleteAction={deleteAction.bind(this, a.id)}
                student={studentForAction}
                reminderButtonCopy="Snooze"
                showTitle={true}
                key={i}
                />
            );
          })}
        </MainContentBody>
      </div>
    );
  }
}

export default props => (
  <DataConsumer>
    {({ saveAction, deleteAction, getReminderActions, students }) => (
      <Reminders
        saveAction={saveAction}
        deleteAction={deleteAction}
        getReminderActions={getReminderActions}
        students={students}
        />
    )}
  </DataConsumer>
);
