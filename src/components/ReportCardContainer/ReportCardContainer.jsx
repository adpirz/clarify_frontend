import _ from 'lodash';
import styled from 'styled-components';
import React from 'react';
import TextField from 'material-ui/TextField';
import { Button } from '../PatternLibrary';
import { fonts } from '../PatternLibrary/constants';
import { ReportCard } from '..';


const ButtonWrapper = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  flex-grow: 1;
  align-items: center;

  button {
    margin: 0 15px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  font-size: ${fonts.large};
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
    const { saveReport, popReportLevel, deselectReport, deleteReport } = this.props;

    const buttons = [(
      <Button key='back' onClick={deselectReport} style={{width: 'auto'}}>Back to Worksheet</Button>
    ),]

    if  (popReportLevel) {
      buttons.push(<Button key='pop' onClick={popReportLevel}> Go Back </Button>);
    }

    if (saveReport) {
        buttons.push(<Button key='save' primary onClick={saveReport}>Save Report</Button>);
    }

    if  (deleteReport) {
      buttons.push(<Button key='pop' onClick={deleteReport}> Delete </Button>);
    }

    return buttons;
  }

  renderFilterNode = () => {
    if (this.props.children.length < 10 ) {
      return null;
    }
    return (
      <div>
        <span>Search: </span>
        <TextField hintText="Type to filter" onChange={this.handleFilter} />
      </div>
    )
  }

  renderCardsOrEmptyState = (filteredChildren) => {
    const { pushReportLevel } = this.props;
    if (!filteredChildren.length) {
      return (
        <EmptyState>
          Hmmm, looks like there's nothing matching that search...
          <span role="img" aria-label="Thinking face">🤔</span>
          <span role="img" aria-label="Thinking face">🤔</span>
          <span role="img" aria-label="Thinking face">🤔</span>
        </EmptyState>
      );
    }
    return (
      <div>
        {_.map(filteredChildren, (child) => {
          return (
            <ReportCard
              selectCard={child.children ? pushReportLevel : null}
              key={child.id}
              {...child}
            />
          );
        })}
      </div>
    );
  }

  render() {
    const { children } = this.props;
    const { filter } = this.state;
    const filteredChildren = _.filter(children, (c) => {
      return c.label.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    });

    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          {this.renderFilterNode()}
          <ButtonWrapper>
            {this.getReportButtons()}
          </ButtonWrapper>
        </div>
        {this.renderCardsOrEmptyState(filteredChildren)}
      </div>
    );
  }
}

export default ReportCardContainer;