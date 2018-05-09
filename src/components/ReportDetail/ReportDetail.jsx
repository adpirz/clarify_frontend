import React from 'react';
import ReactTable from 'react-table'
import _ from 'lodash';
import 'react-table/react-table.css'
import './styles.css'


class ReportDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatStudentRowData = (studentAttendanceData) => {
    let studentDataRow = {};
    const { flags } = _.get(this.props, 'reportData');
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
    const { reportData, students } = this.props;
    let tableData;
    if (reportData) {
      tableData = _.map(reportData.data, (studentRow) => {
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
    const { reportData } = this.props;
    if (!_.size(reportData)) {
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

    const { flags } = _.get(this.props, 'reportData');
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

  getSummaryData = () => {
    const { data } = _.get(this.props, 'reportData');
    let maxAttendancePercentage = 0;
    let minAttendancePercentage = 1;
    let sumAttendance = 0;
    let maxAttendanceStudent = '';
    let minAttendanceStudent = '';
    _.forEach(data, (studentRow) => {
      const attendancePercentage = studentRow.attendance_data[33][1];
      sumAttendance += attendancePercentage;
      if (maxAttendancePercentage < attendancePercentage) {
        maxAttendancePercentage =  attendancePercentage;
        maxAttendanceStudent = studentRow.student_id;
      }
      if (minAttendancePercentage > attendancePercentage) {
        minAttendancePercentage =  attendancePercentage;
        minAttendanceStudent = studentRow.student_id;
      }
    });
    const randomStudent1 = this.props.students[_.random(0, this.props.students.length)];
    const randomStudent2 = this.props.students[_.random(0, this.props.students.length)];
    maxAttendanceStudent = _.find(this.props.students, {id: maxAttendanceStudent}) || randomStudent1;
    minAttendanceStudent = _.find(this.props.students, {id: minAttendanceStudent}) || randomStudent2;
    return {
      count: _.size(data),
      mean: _.round(sumAttendance / _.size(data), 2),
      highestStudent: `${maxAttendanceStudent.first_name} ${maxAttendanceStudent.last_name}`,
      highest: `${_.round(maxAttendancePercentage, 2) * 100}%`,
      lowestStudent: `${minAttendanceStudent.first_name} ${minAttendanceStudent.last_name}`,
      lowest: `${_.round(minAttendancePercentage, 2) * 100}%`,
    };
  }

  selectReport = () => {
    this.props.selectReport(this.props.report);
  }

  render() {
    const data = _.get(this.props, 'reportData.data');
    const { displayMode } = this.props;
    if (_.isEmpty(data)) {
      return null;
    }
    if (displayMode === 'summary') {
      const summaryData = this.getSummaryData();
      return (
        <div onClick={this.selectReport}>
          <div>Number of Students: {summaryData.count}</div>
          <div>Mean: {summaryData.mean}</div>
          <div>Highest: {summaryData.highestStudent} ({summaryData.highest})</div>
          <div>Lowest: {summaryData.lowestStudent} ({summaryData.lowest})</div>
        </div>
      )
    }
    const columns = this.buildColumns();
    const studentRowData = this.buildStudentRowData();
    return (
      <div className="reportDetail">
        <ReactTable
          data={studentRowData}
          columns={columns}
        />
      </div>
    )
  }
}

export default ReportDetail;
