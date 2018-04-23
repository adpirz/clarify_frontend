import React from 'react';
import './Worksheet.css';
import WorksheetItem from './WorksheetItem';

class WorksheetList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { queryResponseValues, selectReport } = this.props;
    return (
      <div>
        {queryResponseValues &&
          <WorksheetItem
            selectReport={selectReport}
          />
        }
      </div>
    );
  }
}

export default WorksheetList;
