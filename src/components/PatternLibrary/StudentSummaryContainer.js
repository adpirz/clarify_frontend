import React from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";
import map from "lodash/map";
import filter from "lodash/filter";

const initialState = {
  actionFormOpen: false,
  actionFormType: undefined,
  actionFormTextValue: "",
  actionFormDueOn: undefined,
  actionFormIsPublic: false,
  actionFormContextDeltaIDs: [],
};

export default class StudentSummaryContainer extends React.Component {
  static propTypes = {
    student: PropTypes.object.isRequired,
    deltas: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    onSubmitAction: PropTypes.func.isRequired,
    actionType: PropTypes.object.string,
  };

  state = initialState;

  handleSubmit = () => {
    const {
      onSubmitAction,
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

    return onSubmitAction({
      type,
      note,
      dueOn,
      completed,
      studentID,
      actionID,
      deltaIDs,
      audience,
    }).then(() => this.setState(initialState));
  };

  toggleContextDelta = deltaID => {
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

  toggleForm = actionTypeSelected => {
    const { actionFormType, actionFormOpen } = this.state;
    if (actionFormType === actionTypeSelected && actionFormOpen) {
      this.setState({ actionFormOpen: false });
    }
    if (actionFormType !== actionTypeSelected && actionFormOpen) {
      this.setState({ actionFormType: actionTypeSelected });
    }
    this.setState({ actionFormType: actionTypeSelected, actionFormOpen: true });
  };

  sortActionsAndDeltas = (actions, deltas) => {
    return sortBy([].concat(actions, deltas), actionOrDelta => {
      return actionOrDelta.sort_date ? actionOrDelta.sort_date : actionOrDelta.created_on;
    });
  };

  render() {
    const { actions, deltas } = this.props;
    const sortedViewModels = this.sortActionsAndDeltas(actions, deltas);

    return map(sortedViewModels, viewModel => {
      return viewModel.note ? <ActionCard action={viewModel} /> : <DeltaCard delta={viewModel} />;
    });
  }
}
