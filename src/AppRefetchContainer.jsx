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
  };
})(App);
