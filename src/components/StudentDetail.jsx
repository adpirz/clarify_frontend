import React from "react";
import get from "lodash/get";
import find from "lodash/find";
import filter from "lodash/filter";
import sortBy from "lodash/sortBy";
import { Grid, Menu, Header, Placeholder } from "semantic-ui-react";

import { DataConsumer } from "../DataProvider";
import { PageRowPosedFactory, PagePosedFactory } from "./PatternLibrary/Posed";

const StudentDetail = ({ students, actions, deltas, saveAction, match }) => {
  if (!students) {
    return null;
  }

  const studentID = parseInt(get(match, "params.studentID"), 10);
  const student = find(students, { id: studentID });
  if (!student) debugger;
  const studentActions = filter(actions, a => {
    return a.student_id === studentID && !!a.completed_on;
  });
  const studentDeltas = filter(deltas, d => d.student_id === studentID);

  const sortedViews = sortBy([].concat(studentActions, studentDeltas), actionOrDelta => {
    return actionOrDelta.sort_date ? actionOrDelta.sort_date : actionOrDelta.created_on;
  });

  return (
    <Grid as={PagePosedFactory()} container padded columns={1}>
      <Grid.Row as={PageRowPosedFactory()}>
        {/* Header for Home Page  */}
        <Grid.Column>
          <Menu color="red" inverted pointing size="massive">
            <Menu.Item header>
              <Header inverted as="h1">
                {student.first_name} {student.last_name}
              </Header>
            </Menu.Item>
          </Menu>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
export default props => (
  <DataConsumer>
    {({ students, actions, deltas, saveAction, deleteAction }) => (
      <StudentDetail
        students={students}
        actions={actions}
        deltas={deltas}
        saveAction={saveAction}
        deleteAction={deleteAction}
        {...props}
      />
    )}
  </DataConsumer>
);
