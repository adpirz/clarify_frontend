import React from "react";
import reduce from "lodash/reduce";
import forEach from "lodash/forEach";
import values from "lodash/values";

import { Header, Grid, Menu } from "semantic-ui-react";

import { DataConsumer } from "../DataProvider";
import { StudentSummaryContainer } from "../components/PatternLibrary";
import { PagePosedFactory, PageRowPosedFactory } from "../components/PatternLibrary/Posed";

const Home = ({ students, actions, deltas, saveAction }) => {
  /**
   * Shape:
   * { <student.id>: { student: <studentobject>, actions: []actions, deltas: []deltas}}
   */
  const studentMap = reduce(
    students,
    (acc, student) =>
      Object.assign({}, acc, { [student.id]: { student, actions: [], deltas: [] } }),
    {}
  );

  forEach(deltas, delta => studentMap[delta.student_id]["deltas"].push(delta));
  forEach(actions, action => studentMap[action.student_id]["actions"].push(action));

  return (
    <Grid as={PagePosedFactory()} container padded columns={1}>
      <Grid.Row as={PageRowPosedFactory()}>
        {/* Header for Home Page  */}
        <Grid.Column>
          <Menu color="red" inverted pointing size="massive">
            <Menu.Item header>
              <Header inverted as="h1">
                Next Steps
              </Header>
            </Menu.Item>
          </Menu>
        </Grid.Column>
      </Grid.Row>

      {/* Container for all homepage student card sets */}
      <Grid.Row as={PageRowPosedFactory()}>
        {values(studentMap)
          .slice(0, 3)
          .map(({ student, actions, deltas }) => (
            <StudentSummaryContainer
              key={student.id}
              student={student}
              studentDetailLink={`/student/${student.id}`}
              actions={actions}
              deltas={deltas}
              onSubmitAction={saveAction}
            />
          ))}
      </Grid.Row>
    </Grid>
  );
};

export default props => (
  <DataConsumer>
    {({ students, actions, saveAction, deltas }) => (
      <Home
        students={students}
        actions={actions}
        saveAction={saveAction}
        deltas={deltas}
        {...props}
      />
    )}
  </DataConsumer>
);
