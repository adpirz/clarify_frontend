/*

<Breadcrumbs
  title={string ("Academic grades for Paloma Garcia Carrasco (latest)")}
  crumbs={[
    {
      label: "McCormick, Tristan",
      query: "?group=student&group_id=241&type=grades...",
    },
    {
      label: "History of Magic, period 2",
      query: "?group=student&group_id=241&type=grades&course_id=25152...",
    },
    {
      label: "Quizzes",
      query: "?group=student&group_id=241&type=grades&course_id=25152&category=25241...",
    },
  ]}
  />
  -GradeCardContainer
    -props
      -children=[
        {
          label: 'Tristan McCormick'
          id: 241
          type: 'student'
          measures: [
            {
              label: "GPA",
              value: "2.8"
            }
          ]
          children: [
            {
              ...RECURSIVE...
              label: " History of Magic, period 2",
              id: 25152,
              type: 'course',
              measures: [
                {
                  label: "Mark"
                  value: "96%",
                },
              ],
              children: [
                {
                  ...
                }
              ]
            }
          ]
        }
    <Card label={string} id={int} measure=[]

*/

import _ from 'lodash';
import React from 'react';
import { DataConsumer } from '../../DataProvider';
import { ReportSummaryContainer } from '../PatternLibrary';
import { ReportCrumbs, ReportCard } from '..';


class GradeReport extends React.Component {
  render() {
    const {
      initialQuery,
      getReportByQuery,
      displayMode,
    } = this.props;

    if (displayMode === 'summary') {
      const handleSelectReport = () => {
        this.props.selectReport(initialQuery);
      };
      return (
        <ReportSummaryContainer onClick={handleSelectReport}> DISPLAY MODE!</ReportSummaryContainer>
      )
    }

    const {
      pushReportLevel,
      popReportLevel,
      reportCrumbs,
    } = this.props;

    const currentReportQuery = _.get(_.last(reportCrumbs), 'query', initialQuery);
    const {
      data: currentReportData,
    } = getReportByQuery(currentReportQuery);
    const {
      title: currentReportTitle,
    } = getReportByQuery(initialQuery);

    return (
      <div style={{width: '100%'}}>
        <ReportCrumbs
          title={currentReportTitle}
          crumbs={reportCrumbs}
          popReportLevel={popReportLevel}
        />
        {_.map(currentReportData, (node) => {
          return (
            <ReportCard
              selectCard={pushReportLevel}
              key={node.id}
              {...node}
            />
          );
        })}
      </div>
    );
  }
}

export default (props) => (
  <DataConsumer>
    {({getReportByQuery}) => (
      <GradeReport getReportByQuery={getReportByQuery} {...props} />
    )}
  </DataConsumer>
);