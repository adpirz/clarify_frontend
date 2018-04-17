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
  };
})(App);
