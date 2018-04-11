import { connect } from 'react-refetch';
import App from './App';


export default connect(() => ({
  testFetch: 'http://localhost:8000/api/test',
  studentFetch: 'http://localhost:8000/api/student/',
  sectionFetch: 'http://localhost:8000/api/section/',
  gradeLevelFetch: 'http://localhost:8000/api/grade-level/',
  schoolFetch: 'http://localhost:8000/api/school/',
}))(App);
