import React from 'react';
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';
import './Dashboard.css';

var ops = [
	{
		label: 'Students',
		options: [{
			label: 'Tristan McCormick',
			value: 'student_name',
			id: 12345,
		},
		{
			label: 'Ariel Salem',
			value: 'student_name',
			id: 23451,
		},
		{
			label: 'Adnan Pirzada',
			value: 'student_name',
			id: 34512,
		},
		],
	},
	{
		label: 'Sections',
		options: [{
			label: 'Science',
			value: 'section_name',
			id: 1,
		},
		{
			label: 'Math',
			value: 'section_name',
			id: 2,
		},
		{
			label: 'Geography',
			value: 'section_name',
			id: 3,
		}],
	},
	{
		label: 'Grade Level',
		options: [{
			label: 'Grade 7',
			value: 'grade_level',
			id: 700,
		},
		{
			label: 'Grade 8',
			value: 'grade_level',
			id: 800,
		},
		{
			label: 'Grade 9',
			value: 'grade_level',
			id: 900,
		}],
	},
	{
		label: 'Schools',
		options: [{
			label: 'Hale Middle School',
			value: 'school_name',
			id: 123,
		},
		{
			label: 'SaMo High School',
			value: 'school_name',
			id: 231,
		},
		{
			label: 'El Camino Real High School',
			value: 'school_name',
			id: 312,
		}],
	},
	{
		label: 'Category',
		options: [
			{
				label: 'Attendance',
				options: [
					{
						label: 'Over X%',
						value: 'attendance_over',
						id: 789,
					},
					{
						label: 'Under X%',
						value: 'attendance_under',
						id: 987,
					},
					{
						label: 'Dates',
						value: 'attendance_date',
						id: 888,
					},
				]
			},
			{
				label: 'Grades',
				options: [
					{
						label: 'Over X%',
						value: 'grades_over',
						id: 789,
					},
					{
						label: 'Under X%',
						value: 'grades_under',
						id: 987,
					},
					{
						label: 'Dates',
						value: 'grades_date',
						id: 888,
					},
				]
			}
		],
	},
];

// TODO: refactor once basic struture exists
class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: [],
		};
	}
	
	handleChange = (value) => {
		this.setState({ value });
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
	validQuery = () => {
		const { value } = this.state;
		let disabled = true;
		console.log('valid: ', value);
		// case statements:
		// while(disabled) {
			// if anything but section
			let allButSection = value.filter(obj => obj.value !== "section_name");
			// next logic flow
			let section = value.filter(obj => obj.value === "section_name");
			if (section.length > 0) {
				// check category
					// check subcategory 
			}
		// }
		
		return disabled;
	}

	render() {
		const { value } = this.state;
		const isDisabled = this.validQuery();
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
									// loadOptions={this.loadOptions}
									multi
									noResultsText="Sorry, your request is invalid"
									onChange={this.handleChange}
								  options={ops}
									value={value}
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

/*
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

		// const { value } = this.state;

		return fetch(`https://api.github.com/search/users?q=${input}`)
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
								<Async
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

*/