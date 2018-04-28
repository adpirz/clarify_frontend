import React from 'react';
import ReactTable from 'react-table'
import _ from 'lodash';
import 'react-table/react-table.css'

class ReportDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatHeader = (value) => {
    value = value.split('_').join(' ');
    return value;
  }

  formatData = (student) => {
    const data = {};
    for (let prop in student.data) {
      data[prop] = student.data[prop];
    }
    return data;
  }

  getStudentName = (id) => {
    const { students } = this.props;
    return _.find(students, { id: id })
  }

  buildTableData = () => {
    const { queryResponseValues } = this.props;
    const tableData = [];
    if (queryResponseValues) {
      for (let i = 0; i < queryResponseValues.length; i++) {
        const id = queryResponseValues[i].student_id;
        const data = this.formatData(queryResponseValues[i]);
        const studentName = this.getStudentName(id);
        data.firstName = studentName.first_name;
        data.lastName = studentName.last_name;
        tableData.push(data);
      }
    }
    return tableData;
  }

  buildColumnsData = () => {
    const { queryResponseValues } = this.props;
    const columns = [{
      Header: 'First Name',
      accessor: 'firstName'
    },
    {
      Header: 'Last Name',
      accessor: 'lastName'
    }];

    if (queryResponseValues) {
      for (let reportField in queryResponseValues[0].data) {
        const header = this.formatHeader(reportField);
        columns.push({
          Header: header,
          accessor: reportField,
        });
      }
    }
    return columns;
  }

  render() {
    const columns = this.buildColumnsData();
    const tableData = this.buildTableData()
    return (
      <ReactTable
        data={tableData}
        columns={columns}
      />
    )
  }
}

export default ReportDetail;
