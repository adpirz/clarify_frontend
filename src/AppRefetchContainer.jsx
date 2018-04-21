import { connect } from 'react-refetch';
import App from './App';


export default connect(() => {
  //TODO: Import baseurl from an environment variable
  const BASE_URL = 'http://localhost:8000'

  return {
    lazyStudentGet: () => ({
      studentGet: {
        url: `${BASE_URL}/api/student/`,
        credentials: 'include',
      },
    }),
    lazySectionGet: () => ({
      sectionGet: {
        url: `${BASE_URL}/api/section/`,
        credentials: 'include',
      },
    }),
    lazyGradeLevelGet: () => ({
      gradeLevelGet: {
        url: `${BASE_URL}/api/grade-level/`,
        credentials: 'include',
      },
    }),
    lazySchoolGet: () => ({
      schoolGet: {
        url: `${BASE_URL}/api/school/`,
        credentials: 'include',
      },
    }),
    lazySessionPost: (username, password) => ({
      sessionPost: {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        url: `${BASE_URL}/api/session/`,
        credentials: 'include',
      },
    }),
    lazyUserGet: () => ({
      userGet: {
        url: `${BASE_URL}/api/user/me`,
        credentials: 'include',
        force: 'true',
      },
    }),
    submitReportQuery: (group, groupIds, category, minDate, maxDate) => {
      const queryString = `group=${group}&${group}_ids=${groupIds.join(',')}&category=${category}&from_date=${minDate}&to_date=${maxDate}`;
      return {
        postReportQuery: {
          url: `${BASE_URL}/report/?${queryString}`,
          credentials: 'include',
        },
      }
    }
  };
})(App);
