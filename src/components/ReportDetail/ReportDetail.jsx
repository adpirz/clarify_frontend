import React from 'react';
import ReactTable from 'react-table'
import _ from 'lodash';
import 'react-table/react-table.css'

class ReportDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatStudentRowData = (studentAttendanceData) => {
    let studentDataRow = {};
    const { flags } = _.get(this.props, 'reportResponse');
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
    const { reportResponse, students } = this.props;
    let tableData;
    if (reportResponse) {
      tableData = _.map(reportResponse.data, (studentRow) => {
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
    const { reportResponse } = this.props;
    if (!_.size(reportResponse)) {
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

    const { flags } = _.get(this.props, 'reportResponse');
    const attendanceColumns = _.map(flags, (flag) => {
      const {text, code} = flag;
      return {
        Header: text,
        accessor: code,
        Cell: props => {
          const { attendanceFlagCount, attendanceFlagPercentage } = props.value;
          return (
            <span>
              {attendanceFlagCount} ({attendanceFlagPercentage})
            </span>
          );
        },
      };
    });
    return [...nameColumns, ...attendanceColumns];
  }

  getSummaryData = () => {
    return {
      count: 25,
      meanStudent: "Ariel Salem",
      mean: "68%",
      highestStudent: "Adnan Pirzada",
      highest: "98%",
      lowestStudent: "Tristan McCormick",
      lowest: "45%",
    };
  }

  render() {
    const { displayMode } = this.props;
    if (displayMode === 'summary') {
      const summaryData = this.getSummaryData();
      return (
        <div>
          <span>Number of Students: {summaryData.count}</span>
          <span>Mean: {summaryData.meanStudent} {summaryData.mean}</span>
          <span>Highest: {summaryData.highestStudent} {summaryData.highest}</span>
          <span>Lowest: {summaryData.lowestStudent} {summaryData.lowest}</span>
        </div>
      )
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

export default ReportDetail;
