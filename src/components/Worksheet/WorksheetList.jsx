import React from 'react';
import './Worksheet.css';
import WorksheetItem from './WorksheetItem';

class WorksheetList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { queryResponseValues } = this.props;
    return (
      <div>
        {queryResponseValues &&
          queryResponseValues.map((value, i) => {
            return (
              <WorksheetItem value={value} key={`worksheet-${i}`} />
            );
          })
        }
      </div>
    );
  }
}

export default WorksheetList;
