import React from 'react';
import './Worksheet.css';

class Worksheet extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { sessionGet: { value: { data } } } = this.props;
		return (
			<div className="worksheetContainer">
				<h4 className="userWorksheetTitle">{data}'s Worksheet</h4>
				<hr />
			</div>
		);
	}
}

export default Worksheet;
