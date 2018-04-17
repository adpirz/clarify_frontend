import { connect } from 'react-refetch';
import App from './App';


export default connect(() => {
  //TODO: Import baseurl from an environment variable
  const BASE_API_URL = 'http://localhost:8000'

  return {
    lazyStudentGet: () => ({
      studentGet: `${BASE_API_URL}/api/student/`,
    }),
    lazySectionGet: () => ({
      sectionGet: `${BASE_API_URL}/api/section/`,
    }),
    lazyGradeLevelGet: () => ({
      gradeLevelGet: `${BASE_API_URL}/api/grade-level/`,
    }),
    lazySchoolGet: () => ({
      schoolGet: `${BASE_API_URL}/api/school/`,
    }),
    lazySessionPost: (username, password) => ({
      sessionPost: {
        method: 'POST',
        body: JSON.stringify({username, password}),
        url: `${BASE_API_URL}/api/session/`,
      },
    }),
    lazySessionGet: () => ({
      sessionGet: {
        url: `${BASE_API_URL}/api/session/`,
      },
    }),
    submitReportQuery: (group, groupId, category, minDate, maxDate) => {
      const queryString = `${group}&${group}_id=${groupId}&category=${category}&from_date=${minDate}&to_date=${maxDate}`;
      return {
        postReportQuery: {
          url: `${BASE_API_URL}/report/group=${queryString}`,
          method: 'POST',
          body: JSON.stringify({
            group: group,
            group_id: groupId,
            category: category,
            minDate: minDate,
            maxDate: maxDate,
          }),
        }
      }
    }
  };
})(App);