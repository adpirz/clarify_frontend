import React from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import map from "lodash/map";
import filter from "lodash/filter";
import { NavLink } from "react-router-dom";
import { Segment, Menu, Header, Icon, Container, Divider } from "semantic-ui-react";
import { PoseGroup } from "react-pose";

import { PoseGroupItemFactory } from "../Posed";
import { DeltaCardListView } from "../DeltaCard";
import ActionCardFormView from "./ActionCardFormView";
import { toast } from "react-toastify";

const GroupPosed = PoseGroupItemFactory();

const initialState = {
  actionFormOpen: true,
  actionFormType: "",
  actionFormTextValue: "",
  actionFormDueOn: "",
  actionFormIsPublic: false,
  actionFormContextDeltaIDs: [],
};

export default class ActionCardContainer extends React.Component {
  static propTypes = {
    student: PropTypes.object.isRequired,
    deltas: PropTypes.array.isRequired,
    action: PropTypes.object,
    actions: PropTypes.array,
    onSubmitAction: PropTypes.func.isRequired,
    actionType: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const { type, note, due_on, is_public, delta_ids } = props.action;

    this.state = {
      actionFormType: type || initialState.actionFormType,
      actionFormTextValue: note || initialState.actionFormTextValue,
      actionFormDueOn: due_on || initialState.actionFormDueOn,
      actionFormIsPublic: is_public || initialState.actionFormIsPublic,
      actionFormContextDeltaIDs: delta_ids || initialState.actionFormContextDeltaIDs,
      actionFormOpen: initialState.actionFormOpen,
    };
  }

  handleSubmit = ({ completed = false }) => {
    const {
      onSubmitAction,
      action,
      student: { id: studentID },
    } = this.props;

    const {
      actionFormType: type,
      actionFormTextValue: note,
      actionFormDueOn: dueOn,
      actionFormIsPublic: audience,
      actionFormContextDeltaIDs: deltaIDs,
    } = this.state;

    const payload = {
      type,
      note,
      dueOn,
      completed,
      studentID,
      deltaIDs,
      audience,
    };
    if (action) {
      payload.actionID = action.id;
    }

    return onSubmitAction(payload).then(res => {
      if (res.status === 200 || res.status === 201) {
        toast.success("Action added!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error("There was a problem 🤔", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      this.setState(initialState);
    });
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

  toggleKey = (key, ...otherState) => {
    this.setState(state => ({ [key]: !state[key], ...otherState }));
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

  setRef = ref => {
    this.setState({ popupRef: ref });
  };

  render() {
    const { student, deltas, action } = this.props;

    const {
      actionFormType,
      actionFormOpen,
      actionFormContextDeltaIDs,
      actionFormIsPublic,
      actionFormTextValue,
      actionFormDueOn,
    } = this.state;

    let dueOnString;
    if (action && action.due_on) {
      dueOnString = `Due on ${format(action.due_on, "MMM D")}`;
    }

    const containerMenu = (
      <Menu size="huge" inverted pointing attached="top">
        <Menu.Item as={NavLink} to={`/student/${student.id}/`}>
          <Header inverted as="h2">
            {student.first_name} {student.last_name}
          </Header>
        </Menu.Item>
        <Menu.Item>{dueOnString}</Menu.Item>
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
      <Segment key={student.id} as={Container} fluid basic>
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
                onSubmitAction={this.handleSubmit}
                actionFormIsPublic={actionFormIsPublic}
                actionFormType={actionFormType}
                actionFormTextValue={actionFormTextValue}
                actionFormDueOn={actionFormDueOn}
                actionFormOnInput={this.handleInput}
                onPublicToggleClick={this.toggleKey.bind(this, "actionFormIsPublic")}
                toggleRemind={this.toggleKey.bind(this, "remindSelected")}
                remindSelected={this.state.remindSelected}
                onDateChange={this.handleDateChange}
                as={GroupPosed}
                setRef={this.setRef}
                contextCount={actionFormContextDeltaIDs.length}
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
          </PoseGroup>
        </Segment>
      </Segment>
    );
  }
}
