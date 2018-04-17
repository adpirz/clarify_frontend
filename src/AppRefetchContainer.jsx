import { connect } from 'react-refetch';
import App from './App';


export default connect(() => {
  //TODO: Import baseurl from an environment variable
  const BASE_API_URL = 'http://localhost:8000'

  return {
    lazyStudentGet: () => ({
      studentGet: {
        url: `${BASE_API_URL}/api/student/`,
        credentials: 'include',
      },
    }),
    lazySectionGet: () => ({
      sectionGet: {
        url: `${BASE_API_URL}/api/section/`,
        credentials: 'include',
      },
    }),
    lazyGradeLevelGet: () => ({
      gradeLevelGet: {
        url: `${BASE_API_URL}/api/grade-level/`,
        credentials: 'include',
      },
    }),
    lazySchoolGet: () => ({
      schoolGet: {
        url: `${BASE_API_URL}/api/school/`,
        credentials: 'include',
      },
    }),
    lazySessionPost: (username, password) => ({
      sessionPost: {
        method: 'POST',
        body: JSON.stringify({username, password}),
        url: `${BASE_API_URL}/api/session/`,
        credentials: 'include',
      },
    }),
    lazySessionGet: () => ({
      sessionGet: {
        url: `${BASE_API_URL}/api/session/`,
        credentials: 'include',
        force: 'true',
      },
    }),
    submitReportQuery: (group, groupId, category, minDate, maxDate) => {
      const queryString = `${group}&${group}_id=${groupId}&category=${category}&from_date=${minDate}&to_date=${maxDate}`;
      return {
        postReportQuery: `${BASE_API_URL}/report/group=${queryString}`,
      }
    }
  };
})(App);