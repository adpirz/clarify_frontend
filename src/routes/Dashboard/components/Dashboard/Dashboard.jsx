import React from 'react';
import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';
import './Dashboard.css';
import data from './../../../../data/data.json';

// TODO: refactor once basic struture exists
class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: [],
			isDisabled: true,
		};
	}
	
	onChange = (value) => {
		this.setState({ value });
	}

	loadOptions = (input) => {
		// TODO: build out section name functionality
		if (!input) {
			return Promise.resolve({ options: [] });
		}

		const { value } = this.state;

		console.log('data: ', data)
		return fetch()
		// return fetch(`https://api.github.com/search/users?q=${input}`)
		.then((response) => response.json())
		.then((json) => {
			return { options: json.items };
		});
	}

	submitQuery = (e) => {
		e.preventDefault();
		console.log('this is being clicked');
	}

	render() {
		const { value, isDisabled } = this.state;
		console.log('data: ', data);
		return (
			<div className="section">
				<h3>Clarify NAVBAR</h3>
				<hr />
				<br />
				<div className="dashboard-container">
					<div className="search-bar">
						<form
							onSubmit={this.submitQuery}
							className="search-container"
						>
							<div className="inline-block dashboard-search">
								<Select
									backspaceRemoves
									labelKey="login"
									loadOptions={this.loadOptions}
									multi
									noResultsText="Sorry, your request is invalid"
									onChange={this.onChange}
									value={value}
									valueKey="id"
								/>
							</div>
							<div className="inline-block">
								<button
									className={`
										${isDisabled ? 'disabled-color' : 'active-color'}
										search-btn
									`}
									disabled={isDisabled}
								>
									Search
								</button>
							</div>
						</form>
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
