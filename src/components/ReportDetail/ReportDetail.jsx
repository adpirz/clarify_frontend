import React from 'react';
import ReactTable from 'react-table'
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

  findStudent = (id) => {
    const { students } = this.props;
    for (let i = 0; i < students.length; i++) {
      if (students[i].id === id) {
        return [students[i].first_name, students[i].last_name];
      }
    }
  }

  renderData = () => {
    const { queryResponseValues } = this.props;
    const tableData = [];
    if (queryResponseValues) {
      for (let i = 0; i < queryResponseValues.length; i++) {
        const id = queryResponseValues[i].student_id;
        const data = this.formatData(queryResponseValues[i]);
        const studentName = this.findStudent(id);
        data.firstName = studentName[0];
        data.lastName = studentName[1];
        tableData.push(data);
      }
    }
    return tableData;
  }

  renderColumns = () => {
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
      for (let prop in queryResponseValues[0].data) {
        const header = this.formatHeader(prop);
        columns.push({
          Header: header,
          accessor: prop,
        });
      }
    }
    return columns;
  }

  render() {
    const columns = this.renderColumns();
    const tableData = this.renderData()
    return (
      <ReactTable
        data={tableData}
        columns={columns}
      />
    )
  }
}

export default ReportDetail;
