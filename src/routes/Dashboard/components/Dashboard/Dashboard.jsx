import React from 'react';
import Select, { Async } from 'react-select';
import 'react-select/dist/react-select.css';
import './Dashboard.css';

const mockData = [{
    value: "students",
    label: "Tristan",
  },
  {
    value: "section",
    label: "Science",
}]

// TODO: refactor once basic struture exists
class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: '', //[],
			isDisabled: true,
		};
	}
	
	handleChange = (selectedOption) => {
		this.setState({ selectedOption });
	}

	// loadOptions = (input) => {
	// 	// TODO: build out section name functionality
	// 	if (!input) {
	// 		return Promise.resolve({ options: [] });
	// 	}

	// 	// const { value } = this.state;

	// 	return fetch(`https://api.github.com/search/users?q=${input}`)
	// 	.then((response) => response.json())
	// 	.then((json) => {
	// 		return { options: json.items };
	// 	});
	// }

	// submitQuery = (e) => {
	// 	e.preventDefault();
	// 	console.log('this is being clicked');
	// }

	render() {
		const { selectedOption, isDisabled } = this.state;
		const value = selectedOption && selectedOption.value;
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
									//backspaceRemoves
									//labelKey="login"
									// loadOptions={this.loadOptions}
									//multi
									//noResultsText="Sorry, your request is invalid"
									onChange={this.handleChange}
									options={[
					          { value: 'one', label: 'One' },
					          { value: 'two', label: 'Two' },
					        ]}
									value={value}
									//valueKey="id"
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
