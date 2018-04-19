import _ from 'lodash';
import React from 'react';
import './Worksheet.css';

class Worksheet extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const userData = _.get(this.props, 'lazyUserGet.value');
		return (
			<div className="worksheetContainer">
				<h4 className="userWorksheetTitle">{userData ? `${userData.first_name} ${userData.last_name}'s'` : ''}&nbsp;Worksheet</h4>
				<hr />
			</div>
		);
	}
}

export default Worksheet;
