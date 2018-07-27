import styled from 'styled-components';
import { darken } from 'polished';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';

import {
  fonts,
  colors,
} from '../../PatternLibrary/constants';


const ActionIcon = styled.i`
  color: ${(props) => {return props.color}};
  font-size: ${fonts.large};
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    color: ${(props) => {return darken(.1, props.color)}};
  }
`;

const ActionIconContainer = styled.div`
  display: inline-flex;
  justify-content: flex-end;
`;

const ModalContents = styled.div`
  width: 50vw;
  height: 35vh;
  overflow: scroll;
  margin: 25vh auto 0;
  padding: 15px;
  background: ${colors.white};
`;

const propTypes = {
  handleSaveClick: PropTypes.func,
  handleShareClick: PropTypes.func,
  handleDeleteClick: PropTypes.func,
  handlePopReportLevel: PropTypes.func,
  report: PropTypes.object,
};

class ReportActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showShareNotesModal: false,
    };
  }

  render() {
    const {
      handleSaveClick,
      handleShareClick,
      handleDeleteClick,
      handlePopReportLevel,
      report,
    } = this.props;

    const actions = [];
    const modals = [];

    if (report && report.shared_by) {
      actions.push((
        <ActionIcon
          key="share_modal"
          className="far fa-comment"
          color={colors.black}
          onClick={() => { this.setState({showShareNotesModal: true})}}
        />
      ));

      let sharedByNode = null;
      if (report.shared_by) {
        sharedByNode = (
          <div>
            <div>
              <label>Shared by:</label>
              <span>{report.shared_by.staff}</span>
            </div>
            <div>
              <label>Note: </label>
              <span>{report.shared_by.note}</span>
            </div>
          </div>
        )
      }
      modals.push((
        <Modal
          key="share_modal"
          open={this.state.showShareNotesModal}
          onClose={() => { this.setState({showShareNotesModal: false})}}>
          <ModalContents>
            {sharedByNode}
          </ModalContents>
        </Modal>
      ))
    }

    if (handlePopReportLevel) {
      actions.push((
        <ActionIcon
          key="pop"
          className="fas fa-share"
          color={colors.black}
          style={{transform: "scaleX(-1)"}}
          onClick={handlePopReportLevel}
        />
      ));
    }

    if (handleSaveClick) {
      actions.push((
        <ActionIcon
          key="save"
          className="fas fa-save"
          color={colors.primaryGreen}
          onClick={handleSaveClick}
        />
      ));
    }

    if (handleShareClick) {
      actions.push((
        <ActionIcon
          key="share"
          className="fas fa-share"
          color={colors.mainTheme}
          onClick={handleShareClick}
        />
      ));
    }

    if (handleDeleteClick) {
      actions.push((
        <ActionIcon
          key="delete"
          className="fas fa-times"
          color={colors.warningRed}
          onClick={handleDeleteClick}
        />
      ));
    }

    return (
      <ActionIconContainer>
        {actions}
        {modals}
      </ActionIconContainer>
    );
  }
};

ReportActions.propTypes = propTypes;

export default ReportActions;