import _ from 'lodash';
import React from 'react';
import { FlatButton } from 'material-ui';
import './Worksheet.css';
import WorksheetList from './WorksheetList';
import ReportDetail from '../ReportDetail/ReportDetail';

class Worksheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  selectReport = () => {
    const { selected } = this.state;
    this.setState({ selected: !selected });
  }

  render() {
    const userData = _.get(this.props, 'userGet.value');
    const { selected } = this.state;
    const { queryResponseValues, students } = this.props;
    return (
      <div className="worksheetContainer">
        {!selected &&
          <div>
            <h4 className="userWorksheetTitle">
              {userData ? `${userData.first_name} ${userData.last_name}'s` : ''}&nbsp;Worksheet
            </h4>
            <hr />
            <WorksheetList
              selectReport={this.selectReport.bind(this)}
              queryResponseValues={queryResponseValues}
            />
          </div>
        }
        {selected &&
          <div>
            <FlatButton
              className="userWorksheetTitle"
              label="Back to Dashboard"
              labelStyle={{
                textTransform: 'Capitalize',
              }}
              onClick={() => { this.selectReport() }}
            />
            <hr />
            <ReportDetail
              students={students}
              queryResponseValues={queryResponseValues}
            />
          </div>
        }
      </div>
    );
  }
}

export default Worksheet;
