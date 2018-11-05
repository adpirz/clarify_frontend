import React from 'react';
import {DataConsumer} from '../DataProvider';

import {
  MainContentBody
} from './PatternLibrary';


class Reminders extends React.Component {
  render() {
    return (
      <MainContentBody>
        REMINDERS
      </MainContentBody>
    )
  }
}

export default (props) => (
  <DataConsumer>
    {({getReminders, students}) => (
      <Reminders
        reminders={getReminders()}
        students={students}
        />
    )}
  </DataConsumer>
);