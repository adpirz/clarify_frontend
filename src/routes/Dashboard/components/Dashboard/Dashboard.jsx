import React from 'react';

import SearchBar from '../SearchBar/SearchBar';
import './Dashboard.css';

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="section">
				<h3>Clarify NAVBAR</h3>
				<hr />
				<br />
				<div className="dashboard-container">
					<div className="search-bar">
						<SearchBar {...this.props} />
						<br />
						<h4 className="user-dashboard-name">User's Dashboard</h4>
						<hr />
					</div>
				</div>
			</div>
		);
	}
}

export default Dashboard;
