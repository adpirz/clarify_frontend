import _ from 'lodash';
import moment from 'moment';

export const generateReportQuery = (parameters) => {
  if (!parameters) {
    return '';
  }

  // Reorder with care. See README for details.
  const PARAMETER_MAPPING = [
    {
      jsParameter: 'group',
      reportParameter: 'group',
    },
    {
      jsParameter: 'groupId',
      reportParameter: 'group_id',
    },
    {
      jsParameter: 'reportType',
      reportParameter: 'type',
    },
    {
      jsParameter: 'fromDate',
      reportParameter: 'from_date',
    },
    {
      jsParameter: 'toDate',
      reportParameter: 'to_date',
    },
    {
      jsParameter: 'courseId',
      reportParameter: 'course_id',
    },
    {
      jsParameter: 'categoryId',
      reportParameter: 'category_id',
    },
    {
      jsParameter: 'assignmentId',
      reportParameter: 'assignment_id',
    },
  ];

  const queryString = _.reduce(PARAMETER_MAPPING, (result, mapping) => {
    const { jsParameter, reportParameter } = mapping;
    let parameterValue = _.get(parameters, jsParameter);
    if (!parameterValue) {
      return result;
    }

    if (jsParameter === 'fromDate' || jsParameter === 'toDate') {
      parameterValue = moment(parameterValue).format('YYYY-MM-DD');
    }

    return result += `${reportParameter}=${parameterValue}&`;
  }, '');

  return queryString.substring(0, queryString.length - 1);
};