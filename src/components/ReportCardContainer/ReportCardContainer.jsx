import _ from 'lodash';
import styled from 'styled-components';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { fonts } from '../PatternLibrary/constants';
import { ReportCard } from '..';


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

  renderFilterNode = () => {
    if (this.props.children.length < 10 ) {
      return null;
    }
    return (
      <div>
        <span>Search: </span>
        <TextField placeholder="Type to filter" onChange={this.handleFilter} />
      </div>
    )
  }

  renderCardsOrEmptyState = (filteredChildren) => {
    const { handlePushReportLevel } = this.props;
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
              selectCard={child.children ? handlePushReportLevel : null}
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
        </div>
        {this.renderCardsOrEmptyState(filteredChildren)}
      </div>
    );
  }
}

export default ReportCardContainer;