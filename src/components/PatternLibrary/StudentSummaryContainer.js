import React from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";
import map from "lodash/map";
import filter from "lodash/filter";
import { NavLink } from "react-router-dom";
import { Segment, Menu, Header, Icon, Container, Card, Button, Divider } from "semantic-ui-react";
import { PoseGroup } from "react-pose";

import { PoseGroupItemFactory } from "./Posed";
import { ActionCard, DeltaCard } from "../PatternLibrary";
import ActionCardFormView from "./ActionCard/ActionCardFormView";
import { DeltaCardListView } from "./DeltaCard";

const GroupPosed = PoseGroupItemFactory();

const initialState = {
  actionFormOpen: false,
  actionFormType: "",
  actionFormTextValue: "",
  actionFormDueOn: "",
  actionFormIsPublic: false,
  actionFormContextDeltaIDs: [],
};

export default class StudentSummaryContainer extends React.Component {
  static propTypes = {
    student: PropTypes.object.isRequired,
    studentDetailLink: PropTypes.string.isRequired,
    deltas: PropTypes.array.isRequired,
    actions: PropTypes.array.isRequired,
    onSubmitAction: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    actionType: PropTypes.string,
  };

  state = initialState;

  handleSubmit = () => {
    const {
      onSubmitAction,
      onSuccess,
      onError,
      student: { id: studentID },
    } = this.props;

    const {
      actionFormType: type,
      actionFormTextValue: note,
      actionFormDueOn: dueOn,
      actionFormIsPublic: audience,
      actionFormContextDeltaIDs: deltaIDs,
    } = this.state;

    const completed = dueOn ? false : true;
    console.log("Saving");
    console.log(onSubmitAction);
    return onSubmitAction({
      type,
      note,
      dueOn,
      completed,
      studentID,
      deltaIDs,
      audience,
    }).then(() => this.setState(initialState));
  };

  handleInput = e => {
    this.setState({ actionFormTextValue: e.target.value });
  };

  handleDateChange = (e, { value }) => {
    this.setState({ actionFormDueOn: value });
  };

  toggleContextDeltaSelected = deltaID => {
    const { actionFormContextDeltaIDs } = this.state;

    if (actionFormContextDeltaIDs.indexOf(deltaID) > -1) {
      this.setState({
        actionFormContextDeltaIDs: filter(actionFormContextDeltaIDs, id => id !== deltaID),
      });
    } else {
      this.setState({
        actionFormContextDeltaIDs: [].concat(actionFormContextDeltaIDs, deltaID),
      });
    }
  };

  togglePublic = () => {
    this.setState(({ actionFormIsPublic }) => ({ actionFormIsPublic: !actionFormIsPublic }));
  };

  toggleFormOpenAndType = actionTypeSelected => {
    const { actionFormType, actionFormOpen } = this.state;
    if (actionFormType === actionTypeSelected && actionFormOpen) {
      this.setState({ actionFormType: "", actionFormOpen: false });
    } else if (actionFormType !== actionTypeSelected && actionFormOpen) {
      this.setState({ actionFormType: actionTypeSelected });
    } else {
      this.setState({ actionFormType: actionTypeSelected, actionFormOpen: true });
    }
  };

  sortActionsAndDeltas = (actions, deltas) => {
    return sortBy([].concat(actions, deltas), actionOrDelta => {
      return actionOrDelta.sort_date ? actionOrDelta.sort_date : actionOrDelta.created_on;
    });
  };

  setRef = ref => {
    this.setState({ popupRef: ref });
  };

  render() {
    const { student, studentDetailLink, actions, deltas, actionFormOnInput } = this.props;

    const {
      actionFormType,
      actionFormOpen,
      actionFormContextDeltaIDs,
      actionFormIsPublic,
      actionFormTextValue,
      actionFormDueOn,
    } = this.state;

    const sortedViewModels = this.sortActionsAndDeltas(actions, deltas);

    const containerMenu = (
      <Menu size="huge" inverted pointing attached="top">
        <Menu.Item as={NavLink} to={studentDetailLink}>
          <Header inverted as="h2">
            {student.first_name} {student.last_name}
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
                key={action.name}
                link
                onClick={this.toggleFormOpenAndType.bind(this, action.value)}
                active={actionFormType === action.value}
              >
                <Icon name={action.icon} />
                {action.name}
              </Menu.Item>
            )
          )}
        </Menu.Menu>
      </Menu>
    );

    return (
      <Segment key={student.student_id} as={Container} fluid basic>
        {containerMenu}
        <Segment
          as={Container}
          style={{ height: "390px", overflow: "hidden" }}
          basic
          attached="bottom"
        >
          <PoseGroup preEnterPose="preEnter">
            {actionFormOpen && (
              <ActionCardFormView
                onSubmitAction={this.handleSubmit.bind(this)}
                actionFormIsPublic={actionFormIsPublic}
                actionFormType={actionFormType}
                actionFormTextValue={actionFormTextValue}
                actionFormDueOn={actionFormDueOn}
                actionFormOnInput={this.handleInput.bind(this)}
                onPublicToggleClick={this.togglePublic}
                onDateChange={this.handleDateChange.bind(this)}
                as={GroupPosed}
                setRef={this.setRef}
                contextCount={actionFormContextDeltaIDs.length}
                bottomMenuItems={[
                  <Button
                    icon
                    secondary
                    labelPosition="left"
                    onClick={this.toggleFormOpenAndType.bind(this, actionFormType)}
                  >
                    <Icon name="arrow circle left" />
                    Back to Summary
                  </Button>,
                ]}
                key="actionForm"
              >
                {deltas
                  .filter(d => actionFormContextDeltaIDs.indexOf(d.delta_id) > -1)
                  .map(delta => (
                    <DeltaCardListView
                      key={delta.delta_id}
                      active
                      delta={delta}
                      onSelect={this.toggleContextDeltaSelected.bind(this, delta.delta_id)}
                      popupRef={this.state.popupRef}
                    />
                  ))}
                {actionFormContextDeltaIDs.length > 0 && <Divider />}
                {deltas
                  .filter(d => actionFormContextDeltaIDs.indexOf(d.delta_id) === -1)
                  .map(delta => (
                    <DeltaCardListView
                      key={delta.delta_id}
                      delta={delta}
                      onSelect={this.toggleContextDeltaSelected.bind(this, delta.delta_id)}
                      popupRef={this.state.popupRef}
                    />
                  ))}
              </ActionCardFormView>
            )}
            {!actionFormOpen && (
              <Card.Group key="cards" as={GroupPosed} itemsPerRow={3}>
                <PoseGroup>
                  {map(sortedViewModels.slice(0, 3), viewModel =>
                    viewModel.note ? (
                      <ActionCard
                        key={viewModel.action_id}
                        as={PoseGroupItemFactory()}
                        summaryView
                        action={viewModel}
                      />
                    ) : (
                      <DeltaCard
                        key={viewModel.delta_id}
                        as={PoseGroupItemFactory()}
                        summaryView
                        delta={viewModel}
                      />
                    )
                  )}
                </PoseGroup>
              </Card.Group>
            )}
          </PoseGroup>
        </Segment>
      </Segment>
    );
  }
}
