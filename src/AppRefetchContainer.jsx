import { connect } from 'react-refetch';
import App from './App';


export default connect(() => {
  const BASE_URL = process.env.NODE_ENV === "production" ? process.env.REACT_APP_BASE_URL : 'http://localhost:8000'

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
    lazySiteGet: () => ({
      siteGet: {
        url: `${BASE_URL}/api/site/`,
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
    lazyUserLogout: () => ({
      userLogoutResponse: {
        url: `${BASE_URL}/api/session/`,
        method: 'DELETE',
        credentials: 'include',
        force: 'true',
      },
    }),
    lazyWorksheetGet: () => ({
      worksheetGet: {
        url: `${BASE_URL}/api/worksheet/`,
        credentials: 'include',
        force: 'true',
      },
    }),
    lazyReportDataGet: (group, groupId, category, minDate, maxDate) => {
      const queryString = `group=${group}&group_id=${groupId}&category=${category}&from_date=${minDate}&to_date=${maxDate}`;
      return {
        reportDataGet: {
          url: `${BASE_URL}/report/?${queryString}`,
          credentials: 'include',
        },
      }
    },
    lazyReportObjectPost: (currentReportQuery) => ({
      reportObjectPost: {
        url: `${BASE_URL}/api/report/`,
        body: JSON.stringify({ query: currentReportQuery }),
        method: 'POST',
        credentials: 'include',
        force: 'true',
        andThen: resp => ({
          worksheetMembershipPost: {
            url: `${BASE_URL}/api/worksheet-membership/`,
            method: 'POST',
            body: JSON.stringify({ report_id: resp.data.id }),
            credentials: 'include',
            force: 'true',
            andThen: resp => ({
              worksheetGet: {
                url: `${BASE_URL}/api/worksheet/`,
                credentials: 'include',
                force: 'true',
              },
            })
          }
        }),
      },
    }),
  };
})(App);
