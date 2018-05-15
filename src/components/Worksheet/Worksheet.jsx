import _ from 'lodash';
import React from 'react';
import { ReportFetcher } from '../../fetchModule';
import { Loading } from '../PatternLibrary/';
import Report from '../Report/Report';

class Worksheet extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      reportDataList: [],
      loading: false,
    };
  }

  componentDidMount() {
    const worksheet = this.props.worksheet;
    if (worksheet) {
      this.getReportDataForWorksheet(worksheet);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getReportDataForWorksheet(nextProps.worksheet);
  }

  getReportDataForWorksheet = (worksheet) => {
    this.setState({loading: true});
    const reportDataFetchPromises = [];
    _.forEach(worksheet.reports, (report) => {
      reportDataFetchPromises.push(ReportFetcher.get(report.id));
    });
    Promise.all(reportDataFetchPromises).then(reportDataList => {
      this.setState({
        reportDataList,
        loading: false,
      });
    })
  }

  render() {
    const { reportDataList, loading } = this.state;
    let worksheetBody = null;
    if (loading) {
      worksheetBody = <Loading />;
    } else if (_.isEmpty(reportDataList)) {
        worksheetBody = (
          <div>
            <p>
              No Reports saved at the moment. Try typing a studen or class name in the
              search bar ☝️
            </p>
        </div>
        );
    } else {
      const { students } = this.props;
      worksheetBody = _.map(reportDataList, (reportDataObject) => {
        return (
          <Report
            displayMode="summary"
            students={students}
            report={reportDataObject}
            key={reportDataObject.report_id}
            selectReport={this.props.selectReport}
          />
        );
      });
    }
    const { currentUser } = this.props;

    return (
      <div>
        <div>
          <div>
            {currentUser ? `${currentUser.first_name} ${currentUser.last_name}'s` : ''}&nbsp;Worksheet
          </div>
          <hr />
        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '20px 0',
            flexWrap: 'wrap'}}>
          {worksheetBody}
        </div>
      </div>
    );
  }
}

export default Worksheet;