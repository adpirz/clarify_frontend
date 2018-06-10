import _ from 'lodash';
import { DataConsumer } from '../../DataProvider';
import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import {
  ReportCardContainer,
  ReportHeading,
} from '..'
import AttendanceReportSummary from './AttendanceReportSummary/AttendanceReportSummary';

const RELEVANT_ATTENDANCE_COLUMN_IDS = [4, 10, 11];

class AttendanceReport extends React.Component {
  getStudentRows = () => {
    const { report: { data }, students} = this.props;

    return _.reduce(data, (activeStudents, node) => {
      const studentForNode = _.find(students, { id: node.student_id });
      if (!studentForNode || !studentForNode.is_enrolled) {
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

  handleSaveReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.saveReport(this.props.report.query);
  }

  handleDeleteReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.deleteReport(this.props.report.id);
  }

  render() {
    const {
      displayMode,
      report,
      selectReport,
    } = this.props;
    if (_.isEmpty(_.get(report, 'data'))) {
      return null;
    }
    if (displayMode === 'summary') {
      return (
        <AttendanceReportSummary
          report={report}
          selectReport={selectReport}
          deleteReport={this.handleDeleteReport}
          saveReport={this.handelSaveReport}
        />
      );
    }
    const {
      deselectReport,
    } = this.props;
    const { title, subheading, id } = report;
    const studentRowData = this.getStudentRows();

    return (

      <Tabs style={{width: '100%'}}>
        <Tab label="Report">
          <ReportHeading title={title} subheading={subheading} />
          <ReportCardContainer
            children={studentRowData}
            deselectReport={deselectReport}
            saveReport={id ? null : this.handleSaveReport}
            deleteReport={id ? this.handleDeleteReport : null}
          />
        </Tab>
        <Tab label="Snapshot"/>
      </Tabs>
    )
  }
}

export default props => (
  <DataConsumer>
    {({saveReport, deleteReport, deselectReport}) => (
      <AttendanceReport
        deselectReport={deselectReport}
        saveReport={saveReport}
        deleteReport={deleteReport}
        {...props}
      />
    )}
  </DataConsumer>
);
