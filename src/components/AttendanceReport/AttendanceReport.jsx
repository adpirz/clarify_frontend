import _ from 'lodash';
import { DataConsumer } from '../../DataProvider';
import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {
  ReportCardContainer,
  ReportHeading,
} from '..'
import AttendanceReportSummary from './AttendanceReportSummary/AttendanceReportSummary';

const RELEVANT_ATTENDANCE_COLUMN_IDS = [4, 10, 11];

class AttendanceReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };
  }

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

  getSnapshotRows = studentRowData => _.sortBy(studentRowData, [(r) => {
    let resultMeasure;
    _.forEach(r.measures, (m) => {
      if(!resultMeasure && m.measure_label === 'Present or Tardy') resultMeasure = m.measure;
    })
    return parseFloat(resultMeasure.slice(0,-1))
  }]).slice(0,5)

  handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.deleteReport(this.props.report.id);
  }

  handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.saveReport(this.props.report.query);
  }

  handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.showShareReportModal(this.props.report.query);
  }

  handleTabChange = (e) => {
    if (this.state.tabIndex === 0) {
      this.setState({tabIndex: 1});
    } else {
      this.setState({tabIndex: 0});
    }
  }

  getTabContents = () => {
    const studentRowData = this.getStudentRows();

    if (this.state.tabIndex === 0) {
      return (
        <ReportCardContainer children={this.getSnapshotRows(studentRowData)} />
      );
    } else {
      return (
        <ReportCardContainer children={studentRowData} />
      );
    }
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
          handleDeleteClick={this.handleDeleteClick}
          handleSaveClick={this.handleSaveClick}
          handleShareClick={this.handleShareClick}
        />
      );
    }
    const {
      deselectReport,
    } = this.props;
    const { title, subheading, id } = report;

    return (
      <div style={{width: '100%'}}>
        <ReportHeading
          title={title}
          subheading={subheading}
          deselectReport={deselectReport}
          handleDeleteClick={!!id ? this.handleDeleteClick : null}
          handleSaveClick={!id ? this.handleSaveClick : null}
          handleShareClick={this.handleShareClick}
        />
        <Tabs
          value={this.state.tabIndex}
          style={{color:'black'}}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          centered={true}
          >
          <Tab label="Report" />
          <Tab label="Snapshot" />
        </Tabs>
        <div style={{padding:'15px'}}>
          {this.getTabContents()}
        </div>
        </div>

    )
  }
}

export default props => (
  <DataConsumer>
    {({saveReport, deleteReport, deselectReport, students}) => (
      <AttendanceReport
        deselectReport={deselectReport}
        saveReport={saveReport}
        deleteReport={deleteReport}
        students={students}
        {...props}
      />
    )}
  </DataConsumer>
);
