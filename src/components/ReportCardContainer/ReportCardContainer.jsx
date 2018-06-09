import _ from 'lodash';
import styled from 'styled-components';
import React from 'react';
import TextField from 'material-ui/TextField';
import { Button } from '../PatternLibrary';
import { ReportCard } from '..';


const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

class ReportCardContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
    };
  }

  handleFilter = (e, newValue) => {
    this.setState({filter: newValue});
  }

  getReportButtons = () => {
    const { saveReport, popReportLevel, deselectReport } = this.props;

    const buttons = [(
      <Button key='back' onClick={deselectReport}>Return to Worksheet</Button>
    ),]

    if (!saveReport) {
        buttons.push(<Button key='save' primary onClick={saveReport}>Save Report</Button>);
    }
    if  (popReportLevel) {
      buttons.push(<Button key='pop' onClick={popReportLevel}> Go Back </Button>);
    }
    return buttons;
  }

  render() {
    const { children, pushReportLevel } = this.props;
    const { filter } = this.state;
    const filteredChildren = _.filter(children, (c) => {
      return c.label.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    });

    return (
      <div>
        <ButtonWrapper>
          <TextField
            hintText="Type to filter"
            onChange={this.handleFilter}
          />
          <div>
            {this.getReportButtons()}
          </div>
        </ButtonWrapper>
        {_.map(filteredChildren, (child) => {
          return (
            <ReportCard
              selectCard={pushReportLevel}
              key={child.id}
              {...child}
            />
          );
        })}
      </div>
    );
  }
}

export default ReportCardContainer;