import React from "react";
import map from "lodash/map";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import reduce from "lodash/reduce";
import without from "lodash/without";
import { NavLink } from "react-router-dom";

import { Segment, Header, Grid, Menu, Icon, Card, Transition, Form } from "semantic-ui-react";

import { ActionCard, DeltaCard } from "../components/PatternLibrary";

import { DataConsumer } from "../DataProvider";

class Home extends React.Component {
  state = {
    selectedStudentId: null,
    type: "",
    deltaIDsForAction: [],
  };

  closeActionForm = () => {
    this.setState({ selectedStudentId: null });
  };

  handleDeltaClick = deltaID => {
    this.setState(({ deltaIDsForAction }) => {
      if (deltaIDsForAction.indexOf(deltaID) > -1) {
        const newDeltaIDsForAction = without(deltaIDsForAction, deltaID);
        return {
          deltaIDsForAction: newDeltaIDsForAction,
        };
      } else {
        deltaIDsForAction.push(deltaID);
        return {
          deltaIDsForAction,
        };
      }
    });
  };

  handleTypeSelection = (newStudentId = null, newType = null) => {
    const { type: oldType, selectedStudentId: oldSelectedStudentId } = this.state;
    // If both type and student are same, then the user clicked the same action
    // icon they used to open the form, so we should close it.
    if (oldType === newType && oldSelectedStudentId === newStudentId) {
      this.setState({
        type: "",
        selectedStudentId: null,
        deltaIDsForAction: [],
      });
    } else {
      // it not, update whatever's new
      this.setState(({ deltaIDsForAction }) => {
        return {
          type: oldType !== newType ? newType : oldType,
          selectedStudentId:
            oldSelectedStudentId !== newStudentId ? newStudentId : oldSelectedStudentId,
          deltaIDsForAction: oldSelectedStudentId !== newStudentId ? [] : deltaIDsForAction,
        };
      });
    }
  };

  getStudentDeltaList = studentViewModel => {
    const { actionsAndDeltas, student } = studentViewModel;

    if (!actionsAndDeltas.length) {
      return <Segment placeholder>Add an action to this timeline</Segment>;
    }

    return map(actionsAndDeltas.slice(0, 3), (node, i) => {
      if (node.note) {
        return (
          <ActionCard showTitle={false} student={student} action={node} key={node.action_id} />
        );
      } else {
        debugger;
        return <DeltaCard delta={node} key={node.delta_id} />;
      }
    });
  };

  getStudentViewModels = student => {
    const { actions, deltas, students } = this.props;

    if (!students || !students.length) {
      return null;
    }

    const studentViewModels = reduce(
      students,
      (accumulator, student) => {
        const actionsForStudent = filter(actions, a => {
          return a.student_id === student.id;
        });
        const deltasForStudent = filter(deltas, d => {
          return d.student_id === student.id;
        });

        const combinedAndSorted = orderBy(
          actionsForStudent.concat(deltasForStudent),
          ["created_on"],
          ["desc"]
        );

        accumulator.push({
          student,
          actionsAndDeltas: combinedAndSorted,
          mostRecentAction: actionsForStudent.length ? actionsForStudent[0].created_on : null,
        });
        return accumulator;
      },
      []
    );

    return orderBy(studentViewModels, ["mostRecentAction"], ["desc"]);
  };

  render() {
    const studentViewModels = this.getStudentViewModels();

    if (!studentViewModels || !studentViewModels.length) {
      return null;
    }

    return (
      <Grid columns={16}>
        <Grid.Column width={14}>
          <Menu color="red" inverted pointing size="massive">
            <Menu.Item header>
              <Header inverted as="h1">
                Next Steps
              </Header>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Icon name="sticky note" />
                Note
              </Menu.Item>
              <Menu.Item>
                <Icon name="phone" />
                Call
              </Menu.Item>
              <Menu.Item>
                <Icon name="chat" />
                Message
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Grid.Column>
        <Grid.Column width={14}>
          {map(studentViewModels.slice(0, 3), (studentViewModel, i) => {
            const { student } = studentViewModel;
            const activeStudent = this.state.selectedStudentId === student.id;
            return (
              <Segment basic>
                <Menu size="massive" inverted pointing attached="top">
                  <Menu.Item header as={NavLink} to={`/student/${student.id}`}>
                    <Header inverted as="h2">
                      {student.first_name} {student.last_name[0]}
                    </Header>
                  </Menu.Item>
                  <Menu.Menu position="right">
                    {map(
                      [
                        { name: "Note", value: "note", icon: "sticky note" },
                        { name: "Call", value: "call", icon: "phone" },
                        { name: "Message", value: "message", icon: "chat" },
                      ],
                      action => (
                        <Menu.Item
                          link
                          onClick={this.handleTypeSelection.bind(this, student.id, action.value)}
                          active={
                            this.state.type === action.value &&
                            this.state.selectedStudentId === student.id
                          }
                        >
                          <Icon name={action.icon} />
                          {action.name}
                        </Menu.Item>
                      )
                    )}
                  </Menu.Menu>
                </Menu>
                <Transition.Group animation="slide down">
                  {activeStudent ? (
                    <Segment inverted attached="bottom">
                      <Form inverted>
                        <Form.Field
                          control="textarea"
                          label="Note"
                          placeholder="I noticed that...."
                        />
                        <Form.Field control="input" type="checkbox" label="Publicly visible?" />
                      </Form>
                    </Segment>
                  ) : null}
                </Transition.Group>
                <Segment basic attached="bottom">
                  <Card.Group itemsPerRow={3}>
                    {this.getStudentDeltaList(studentViewModel)}
                  </Card.Group>
                </Segment>
              </Segment>
            );
          })}
        </Grid.Column>
      </Grid>
    );
  }
}

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
