import _ from 'lodash';
import styled from 'styled-components';
import Select from 'react-select';
import React from 'react';
import PropTypes from 'prop-types';
import { DataConsumer } from '../../DataProvider';
import { Button } from '../PatternLibrary';
import { colors } from '../PatternLibrary/constants';

const FormContainer = styled.div`
  width: 45%;
  margin: 10vh auto;
  background-color: ${colors.white};
  padding: 25px;
`;

class ShareReportForm extends React.Component {
  propTypes: {
    shareReport: PropTypes.func,
    closeModal: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedStaff: [],
      note: null,
    };
  }

  handleStaffChange = (selectedStaff) => {
    this.setState({
      selectedStaff,
    });
  }

  handleNoteChange = (e) => {
    this.setState({
      note: e.target.value,
    });
  }

  handleShareReportClick = (e) => {
    this.props.shareReport(this.state.selectedStaff, this.state.note);
  }

  render() {
    return (
      <FormContainer>
        <h3>Which staff would you like to share this with?</h3>
        <Select
          isMulti
          options={_.map(this.props.staff, (s) => {
            return {
              value: s.id,
              label: s.name,
            };
          })}
          value={this.state.selectedStaff}
          onChange={this.handleStaffChange}
      />
    <label htmlFor="note">Note:</label>
      <textarea
        id="note"
        placeholder="e.g. A date for a follow-up or a student who you think needs special attention."
        style={{width: '100%'}}
        onChange={this.handleNoteChange}
        rows={4}
      / >
      <Button onClick={this.handleShareReportClick} style={{display: 'block', margin: '20px auto', minWidth: 'null'}}>
        Share Report
      </Button>
      </FormContainer>
    );
  }
}

export default props => (
  <DataConsumer>
    {({staff}) => (<ShareReportForm staff={staff} {...props} />)}
  </DataConsumer>
)