import _ from 'lodash';
import React from 'react';
import { ReportCard } from '..';



class ReportCardContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
    };
  }

  handleFilter = (e) => {
    const { value } = e;
    this.setState({filter: value});
  }

  render() {
    const { children, pushReportLevel } = this.props;
    const { filter } = this.state;
    const filteredChildren = _.filter(children, (c) => {
      return c.label.indexOf(filter) > -1;
    });
    return (
      <div>
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