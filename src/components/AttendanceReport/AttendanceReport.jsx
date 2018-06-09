import _ from 'lodash';
import { DataConsumer } from '../../DataProvider';
import React from 'react';
import {
  AttendanceReportSummary,
  ReportCardContainer,
  ReportCrumbs,
} from '..'

const RELEVANT_ATTENDANCE_COLUMN_IDS = [4, 10, 11];

class AttendanceReport extends React.Component {
  getStudentRows = () => {
    const { report: { data }, students} = this.props;

    return _.map(data, (node) => {
      const studentForNode = _.find(students, { id: node.student_id });
      const attendanceComposite = _.reduce(node.attendance_data, (result, column) => {
        if (_.includes(RELEVANT_ATTENDANCE_COLUMN_IDS, column.column_code)) {
          result += column.column_percentage;
        }
        return result;
      }, 0);
      return {
        label: `${studentForNode.last_name}, ${studentForNode.first_name}`,
        id: node.student_id,
        measures: [
          {
            measure_label: 'Present or Tardy',
            measure: attendanceComposite ? attendanceComposite + '%' : '-',
          },
          {
            measure_label: 'Other',
            measure: attendanceComposite ? 100 - attendanceComposite + '%' : '-',
          },
        ]
      }
    });
  }

  saveReport = (e) => {
    e.preventDefault();
    this.props.saveReport(this.props.report.query);
  }

  render() {
    const {
      displayMode,
      report,
      students,
      selectReport,
      deleteReport,
      saveReport
    } = this.props;
    if (_.isEmpty(_.get(report, 'data'))) {
      return null;
    }
    if (displayMode === 'summary') {
      return (
        <AttendanceReportSummary
          report={report}
          students={students}
          selectReport={selectReport}
          deleteReport={deleteReport}
          saveReport={saveReport}
        />
      );
    }
    const {
      pushReportLevel,
      popReportLevel,
      deselectReport,
      reportCrumbs,
    } = this.props;
    const { title, subheading } = report;
    const studentRowData = this.getStudentRows();

    return (
      <div style={{width: '100%'}}>
        <ReportCrumbs title={title} subheading={subheading} crumbs={reportCrumbs} />
        <ReportCardContainer
          children={studentRowData}
          pushReportLevel={pushReportLevel}
          popReportLevel={reportCrumbs.length ? popReportLevel : null}
          deselectReport={deselectReport}
        />
      </div>
    )
  }
}

export default props => (
  <DataConsumer>
    {({saveReport, deleteReport, deselectReport, students}) => (
      <AttendanceReport
        deselectReport={deselectReport}
        saveReport={saveReport}
        deleteReport={deleteReport}
        students={students}
        {...props}
      />
    )}
  </DataConsumer>
);
