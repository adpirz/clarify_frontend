import _ from 'lodash';
import { DataConsumer } from '../../DataProvider';
import React from 'react';

import {
  ReportCardContainer,
  ReportHeading,
} from '..'
import AttendanceReportSummary from './AttendanceReportSummary/AttendanceReportSummary';

const RELEVANT_ATTENDANCE_COLUMN_IDS = [4, 10, 11];

class AttendanceReport extends React.Component {
  getStudentRows = () => {
    const { reportData: { data }, students} = this.props;

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

  handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.deleteReport(this.props.reportData.id);
  }

  handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.saveReport(this.props.reportData.query);
  }

  handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.showShareReportModal(this.props.reportData.query);
  }

  render() {
    const {
      displayMode,
      reportData,
      selectReport,
    } = this.props;
    if (_.isEmpty(_.get(reportData, 'data'))) {
      return null;
    }
    if (displayMode === 'summary') {
      return (
        <AttendanceReportSummary
          reportData={reportData}
          selectReport={selectReport}
          handleDeleteClick={this.handleDeleteClick}
          handleSaveClick={this.handleSaveClick}
          handleShareClick={this.handleShareClick}
        />
      );
    }
    const {
      deselectReport,
      getReportById,
    } = this.props;
    const { title, id: reportId } = reportData;
    const studentRowData = this.getStudentRows();

    return (
      <div style={{width: '100%'}}>
        <ReportHeading
          reportId={reportId}
          getReportById={getReportById}
          title={title}
          deselectReport={deselectReport}
          handleDeleteClick={!!reportId ? this.handleDeleteClick : null}
          handleSaveClick={!reportId ? this.handleSaveClick : null}
          handleShareClick={this.handleShareClick}
        />
        <div style={{padding:'15px'}}>
          <ReportCardContainer children={studentRowData} />
        </div>
        </div>

    )
  }
}

export default props => (
  <DataConsumer>
    {({saveReport, deleteReport, deselectReport, students, getReportById}) => (
      <AttendanceReport
        deselectReport={deselectReport}
        saveReport={saveReport}
        deleteReport={deleteReport}
        students={students}
        getReportById={getReportById}
        {...props}
      />
    )}
  </DataConsumer>
);
