import React from 'react';
import ReactTable from 'react-table'
import _ from 'lodash';
import 'react-table/react-table.css'
import { ReportSummary } from '../PatternLibrary';


class Report extends React.Component {
  formatStudentRowData = (studentAttendanceData) => {
    let studentDataRow = {};
    const excludeColumns = _.get(this.props, 'report.exclude_columns');
    _.forEach(studentAttendanceData, (studentAttendanceNode) => {
      if (_.includes(excludeColumns, studentAttendanceNode.column_code)) {
        return;
      }
      const attendanceFlagCount = studentAttendanceNode.count;
      const attendanceFlagPercentage = studentAttendanceNode.percentage;
      studentDataRow[studentAttendanceNode.column_code] = {
          attendanceFlagCount,
          attendanceFlagPercentage,
        };
      }
    );
    return studentDataRow;
  }

  buildStudentRowData = () => {
    const { report, students } = this.props;
    let tableData;
    if (report.data) {
      tableData = _.map(report.data, (studentRow) => {
        const student = _.find(students, { source_object_id: studentRow.student_id });
        const formattedData = this.formatStudentRowData(studentRow.attendance_data);
        formattedData.firstName = _.get(student, 'first_name') || 'Student';
        formattedData.lastName = _.get(student, 'last_name') || '';
        return formattedData;
      });
    }
    return tableData;
  }

  buildColumns = () => {
    const { report } = this.props;
    if (!_.size(report.data)) {
      return null;
    }
    const nameColumns = [{
      Header: 'First Name',
      accessor: 'firstName'
    },
    {
      Header: 'Last Name',
      accessor: 'lastName'
    }];

    const columns = _.get(this.props, 'report.columns');
    const excludeColumns = _.get(this.props, 'report.exclude_columns');
    const attendanceColumns = _.reduce(columns, (accumulator, column) => {
      if (_.includes(excludeColumns, column.column_code)) {
        return accumulator;
      }
      const {label, column_code} = column;
      accumulator.push({
        Header: label,
        accessor: `${column_code}`,
        Cell: props => {
          const { attendanceFlagCount, attendanceFlagPercentage } = props.value;
          return (
            <span>
              {attendanceFlagCount} ({_.round(attendanceFlagPercentage * 100, 2)}%)
            </span>
          );
        },
      });
      return accumulator;
    }, []);
    return [...nameColumns, ...attendanceColumns];
  }

  render() {
    const { displayMode, report, students, selectReport } = this.props;
    if (_.isEmpty(report.data)) {
      return null;
    }
    if (displayMode === 'summary') {
      return (
        <ReportSummary
          report={report}
          students={students}
          selectReport={selectReport}>
        </ReportSummary>
      );
    }
    const columns = this.buildColumns();
    const studentRowData = this.buildStudentRowData();
    return (
      <ReactTable
        data={studentRowData}
        columns={columns}
      />
    )
  }
}

export default Report;
