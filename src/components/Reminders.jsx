import React from "react";
import { DataConsumer } from "../DataProvider";

import { MainContentBody, PageHeading } from "./PatternLibrary";

class Reminders extends React.Component {
  render() {
    return (
      <div>
        <PageHeading />
        <MainContentBody>REMINDERS</MainContentBody>
      </div>
    );
  }
}

export default props => (
  <DataConsumer>
    {({ getReminders, students }) => (
      <Reminders reminders={getReminders()} students={students} />
    )}
  </DataConsumer>
);
