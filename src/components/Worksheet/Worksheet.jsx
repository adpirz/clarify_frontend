import _ from 'lodash';
import React from 'react';
import { DataConsumer } from '../../DataProvider';
import { Loading } from '../PatternLibrary/';
import { AttendanceReport } from '../';
import { fonts } from '../PatternLibrary/constants';

class Worksheet extends React.PureComponent {
  render() {
    const {
      reportDataList,
      isLoading,
      worksheet,
      selectedReportQuery
    } = this.props;
    let worksheetBody = null;
    if (isLoading || !worksheet) {
      return <Loading />;
    } else if (_.isEmpty(reportDataList)) {
        worksheetBody = (
          <div>
            <p>
              No Reports saved at the moment. Try typing a student or class name in the
              search bar <span role="img" aria-label="pointing up to search bar">☝️</span>
            </p>
        </div>
        );
    } else if (selectedReportQuery) {
      const reportForDisplay = _.find(reportDataList, {query: selectedReportQuery});
      worksheetBody = (
        <AttendanceReport
          report={reportForDisplay}
          back={this.props.deselectReport}
        />
      );
    } else {
      worksheetBody = _.map(reportDataList, (reportDataObject) => {
        return (
          <AttendanceReport
            displayMode="summary"
            report={reportDataObject}
            key={reportDataObject.query}
            selectReport={this.props.selectReport}
          />
        );
      });
    }
    return (
      <div>
        <div>
          <span style={{fontSize: fonts.large}}>
            {worksheet.title}
          </span>
          <hr style={{margin: '0', width: '50%'}}/>
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

export default props => (
  <DataConsumer>
    {({
      user,
      reportDataList,
      isLoading,
      worksheet,
      selectReport,
      deselectReport,
      selectedReportQuery}) => (
      <Worksheet
        user={user}
        reportDataList={reportDataList}
        isLoading={isLoading}
        worksheet={worksheet}
        selectReport={selectReport}
        deselectReport={deselectReport}
        selectedReportQuery={selectedReportQuery}
        {...props}
      />
    )}
  </DataConsumer>
)