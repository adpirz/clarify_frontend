import _ from 'lodash';
import styled from 'styled-components';
import { DataConsumer } from '../../DataProvider';
import React from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { AttendanceReportSummary, Button } from '../PatternLibrary';
import { fonts } from '../PatternLibrary/constants';


const Title = styled.span`
  font-weight: bold;
  font-size: ${fonts.large};
`;

const Subheading = styled.span`
  font-size: ${fonts.medium};
  opacity: .5;
`;

class AttendanceReport extends React.Component {
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
        const student = _.find(students, { id: studentRow.student_id });
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
          let attendanceNode = 0;
          if (attendanceFlagCount) {
            attendanceNode = `${attendanceFlagCount} (${_.round(attendanceFlagPercentage * 100, 2)}%)`;
          }
          return (
            <span>
              {attendanceNode}
            </span>
          );
        },
      });
      return accumulator;
    }, []);
    return [...nameColumns, ...attendanceColumns];
  }

  saveReport = (e) => {
    e.preventDefault();
    this.props.saveReport(this.props.report.query);
  }

  getReportButtons = () => {
    if (this.props.displayMode === 'summary') {
      return null;
    }
    const buttons = [(
      <Button key='back' onClick={this.props.back}>Back</Button>
    ),]
    if (!this.props.report.id) {
        buttons.push(<Button key='save' primary onClick={this.saveReport}>Save Report</Button>)
    }

    return buttons;
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
    const columns = this.buildColumns();
    const studentRowData = this.buildStudentRowData();
    const { title, subheading } = _.get(this.props, 'report');
    return (
      <div>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexShrink: '0',
            alignItems: 'center',
          }}>
          <div>
            <Title>{title}</Title>&nbsp;--&nbsp;
            <Subheading>{subheading}</Subheading>
          </div>
          {this.getReportButtons()}
        </div>
        <ReactTable
          data={studentRowData}
          columns={columns}
          sortable={false}
          resizable={false}
          defaultPageSize={10}
        />
      </div>
    )
  }
}

export default props => (
  <DataConsumer>
    {({saveReport, deleteReport, students}) => (
      <AttendanceReport
        saveReport={saveReport}
        deleteReport={deleteReport}
        students={students}
        {...props}
      />
    )}
  </DataConsumer>
);
