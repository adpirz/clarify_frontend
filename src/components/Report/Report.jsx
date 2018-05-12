import React from 'react';
import ReactTable from 'react-table'
import _ from 'lodash';
import 'react-table/react-table.css'
import { ReportSummary } from '../PatternLibrary';


class Report extends React.Component {
  formatStudentRowData = (studentAttendanceData) => {
    let studentDataRow = {};
    const { flags } = _.get(this.props, 'report');
    _.forEach(_.keys(studentAttendanceData), (key) => {
      const attendanceFlagCode = flags[key].code;
      const attendanceFlagCount = studentAttendanceData[key][0];
      const attendanceFlagPercentage = studentAttendanceData[key][1];
      studentDataRow[attendanceFlagCode] = {
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
        const studentName = _.find(students, { id: studentRow.student_id });
        const formattedData = this.formatStudentRowData(studentRow.attendance_data);
        formattedData.firstName = _.get(studentName, 'first_name') || 'Student';
        formattedData.lastName = _.get(studentName, 'last_name') || '';
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

    const { flags } = _.get(this.props, 'report');
    const attendanceColumns = _.map(flags, (flag) => {
      const {text, code} = flag;
      return {
        Header: text,
        accessor: code,
        Cell: props => {
          const { attendanceFlagCount, attendanceFlagPercentage } = props.value;
          return (
            <span>
              {attendanceFlagCount} ({_.round(attendanceFlagPercentage, 2)}%)
            </span>
          );
        },
      };
    });
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
      <div>
        <ReactTable
          data={studentRowData}
          columns={columns}
        />
      </div>
    )
  }
}

export default Report;
