import styled from 'styled-components';
import Select, { components, createFilter } from 'react-select';
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { colors } from '../PatternLibrary/constants';

const FormContainer = styled.div`
  width: 45%;
  margin: 0 auto;
  background-color: ${colors.white};
`;

class ShareReportForm extends React.Component {
  propTypes: {
    text: PropTypes.string,
  }

  render() {
    return (
      <FormContainer>
        <h3>Which staff would you like to share this with?</h3>
        <TextField>
        </TextField>
      </FormContainer>
    );
  }
}

export default ShareReportForm;