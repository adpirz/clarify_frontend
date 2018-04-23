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
    let data = {};
    for (let prop in student.data) {
      data[prop] = student.data[prop];
    }
    return data;
  }

  findStudent = (id) => {
    const { students } = this.props;
    for (let i = 0; i < students.length; i++) {
      if (students[i].id === id) {
        return this.formatStudentName(students[i].name);
      }
    }
  }

  formatStudentName = (name) => name.split(' ');

  renderData = () => {
    const { queryResponseValues } = this.props;
    let result = [];
    for (let i = 0; i < queryResponseValues.length; i++) {
      let id = queryResponseValues[i].student_id;
      let data = this.formatData(queryResponseValues[i]);
      let studentName = this.findStudent(id);
      data.firstName = studentName[0];
      data.lastName = studentName[1];
      result.push(data);
    }
    return result;
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
    for (let prop in queryResponseValues[0].data) {
      let header = this.formatHeader(prop);
      columns.push({
        Header: header,
        accessor: prop,
      });
    }
    return columns;
  }

  render() {
    let columns = this.renderColumns();
    let data = this.renderData()
    return (
      <ReactTable
        data={data}
        columns={columns}
      />
    )
  }
}

export default ReportDetail;
