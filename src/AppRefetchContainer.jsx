import { connect } from 'react-refetch';
import App from './App';


export default connect(() => ({
  testFetch: 'http://localhost:8000/api/test',
  studentFetch: 'http://localhost:8000/api/student/',
  sectionFetch: 'http://localhost:8000/api/section/',
  gradeLevelFetch: 'http://localhost:8000/api/grade-level/',
  schoolFetch: 'http://localhost:8000/api/school/',
  submitReportQuery: (group, groupId, category, minDate, maxDate) => ({
	  postReportQuery: {
	    url: `/report/group=${group}&${group}_id=
			${groupId}&category=${category}&
			from_date=${minDate}&to_date=${maxDate}`,
	    method: 'POST',
	    body: JSON.stringify({
	    	group: group,
	    	group_id: groupId,
	    	category: category,
	    	minDate: minDate,
	    	maxDate: maxDate,
	    }),
	  }
	})
}))(App);
