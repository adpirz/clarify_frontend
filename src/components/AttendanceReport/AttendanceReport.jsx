import _ from 'lodash';
import { DataConsumer } from '../../DataProvider';
import React from 'react';
import {
  AttendanceReportSummary,
  ReportCardContainer,
  ReportHeading,
} from '..'

const RELEVANT_ATTENDANCE_COLUMN_IDS = [4, 10, 11];

class AttendanceReport extends React.Component {
  getStudentRows = () => {
    const { report: { data }, students} = this.props;

    return _.reduce(data, (activeStudents, node) => {
      const studentForNode = _.find(students, { id: node.student_id });
      if (!studentForNode.is_enrolled) {
        return activeStudents;
      }

      const attendanceComposite = _.reduce(node.attendance_data, (result, column) => {
        if (_.includes(RELEVANT_ATTENDANCE_COLUMN_IDS, column.column_code)) {
          result += column.percentage;
        }
        return result;
      }, 0);

      activeStudents.push(
        {
          label: `${studentForNode.last_name}, ${studentForNode.first_name}`,
          id: node.student_id,
          measures: [
            {
              measure_label: 'Present or Tardy',
              measure: attendanceComposite ? _.round(attendanceComposite * 100, 2) + '%' : '-',
            },
            {
              measure_label: 'Other',
              measure: attendanceComposite ? _.round(100 - 100 * attendanceComposite, 2) + '%' : '-',
            },
          ]
        }
      )
      return activeStudents;
    }, []);
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
      deselectReport,
    } = this.props;
    const { title, subheading } = report;
    const studentRowData = this.getStudentRows();

    return (
      <div style={{width: '100%'}}>
        <ReportHeading title={title} subheading={subheading} />
        <ReportCardContainer
          children={studentRowData}
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
