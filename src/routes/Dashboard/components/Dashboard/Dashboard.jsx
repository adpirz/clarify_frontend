import React from 'react';
import { Async } from 'react-select';
import 'react-select/dist/react-select.css';
import './Dashboard.css';

// TODO: refactor once basic struture exists
class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: [],
		};
	}
	
	onChange = (value) => {
		this.setState({
			value: value,
		});
	}

	getUsers = (input) => {
		if (!input) {
			return Promise.resolve({ options: [] });
		}

		return fetch(`https://api.github.com/search/users?q=${input}`)
		.then((response) => response.json())
		.then((json) => {
			return { options: json.items };
		});
	}

	gotoUser = (value, event) => {
		window.open(value.html_url);
	}

	submitQuery = (e) => {
		e.preventDefault();
		console.log('this is being clicked');
	}

	render() {
		const { value } = this.state;
		return (
			<div className="section">
				<h3>DASHBOARD</h3>
				<div className="search-bar">
					<form
						onSubmit={this.submitQuery}
						className="search-container"
					>
						<div className="inline-block dashboard-search">
							<Async
								multi
								value={this.state.value}
								onChange={this.onChange}
								onValueClick={this.gotoUser}
								valueKey="id"
								labelKey="login"
								loadOptions={this.getUsers}
								backspaceRemoves
								noResultsText="Sorry, your request is invalid"
							/>
						</div>
						<div className="inline-block">
							<button
								className="search-btn"
								disabled={value.length < 3}
							>
								Search
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default Dashboard;
