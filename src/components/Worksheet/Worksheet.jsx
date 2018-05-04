import _ from 'lodash';
import React from 'react';
import './Worksheet.css';
import ReportDetail from '../ReportDetail/ReportDetail';

class Worksheet extends React.Component {
  render() {
    const { reports, students, user } = this.props;
    return (
      <div className="worksheetContainer">
        <div>
          <div className="userWorksheetTitle">
            {user ? `${user.first_name} ${user.last_name}'s` : ''}&nbsp;Worksheet
          </div>
          <hr />
        </div>
        <div>
          {_.map(reports, (report) => {
            return (
              <ReportDetail
                displayMode="summary"
                students={students}
                reportDate={report.data}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default Worksheet;
