import { connect } from 'react-refetch';
import App from './App';


export default connect(() => ({
  testFetch: 'http://localhost:8000/api/test',
}))(App);
