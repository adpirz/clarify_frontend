import React from 'react';
import Select from 'react-select-plus';
import { PromiseState } from 'react-refetch';
import { CircularProgress, DatePicker } from 'material-ui';
import 'react-select-plus/dist/react-select-plus.css';

import './SearchBar.css';

let options = [
	{
		label: 'Students',
		options: [],
	},
	{
		label: 'Sections',
		options: [],
	},
	{
		label: 'Schools',
		options: [],
	},
	{
		label: 'Grade Level',
		options: [],
	},
	{
		label: 'Attendance',
		options: [{
			label: 'Attendance',
			value: 'attendance',
			id: 999,
		}],
	},
	{
		label: 'Academic Grades',
		options: [{
			label: 'Academic Grades',
			value: 'student_grades',
			id: 999,
		}],
	},
];

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		const minDate = new Date();
		const maxDate = new Date();
		
		minDate.setFullYear(minDate.getFullYear()); // will get start of school year date from DB
		maxDate.setFullYear(maxDate.getFullYear());
		
		this.state = {
			selectedOption: [],
      minDate: minDate,
      maxDate: maxDate,
      options: [],
		};
	}

	handleChangeMinDate = (event, date) => {
	  this.setState({ minDate: date });
	};

	handleChangeMaxDate = (event, date) => {
	  this.setState({ maxDate: date });
	};

	handleChange = (selectedOption) => {
		// give disabled property to non-selected;
		// let group = false;
		// let category = false;
		// for(let i = 0; i < selectedOption.length; i++) {
		// 	const { value } = selectedOption[i];
		// 	if (value === 'student_name' || value === 'school_name' ||
		// 		value === 'section_name' || value === 'grade_level') {
		// 		group = true;
		// 	}
		// 	if (value === 'attendance' || value === 'student_grades') {
		// 		category = true;
		// 	}
		// }

		// if (group) {
		// 	options.forEach((o) => {
		// 		const { label } = o;
		// 		if (label === 'Schools' || label === 'Sections' ||
		// 			label === 'Students' || label === 'Grade Level')  {
		// 			console.log('O: ', o)
		// 			o.options[0].disabled = true;
		// 		}
		// 	});
		// 	console.log('filtered: ', options);
		// 	// options = filtered;
		// 	// debugger;
		// }

		// console.log('filtered: ', filtered);

		// if (category) {
			// disable
							// if (label === 'Schools' || label === 'Sections' ||
					// label === 'Students' || label === 'Grade Level') {
					// return groupObj
				// }
		// }
		// console.log('selectedOption: ', selectedOption);
		this.setState({ selectedOption });
	}

	optionsGenerator = (labelString, dataArray, optionValue) => {
		let index;
		for (let i = 0; i < options.length; i++) {
			if (options[i].label === labelString) {
				index = i;
			}
		}
		
		dataArray.forEach((dataObj) => {
			let optionsArray = {
				label: dataObj.name,
				value: optionValue,
				id: dataObj.id,
			}
			if (index !== undefined) {
				options[index].options.push(optionsArray);
			}
		});
	}

	submitQuery = (e) => {
		e.preventDefault();
		const { selectedOption, minDate, maxDate } = this.state;
		
		let group;
		let category;

		let groupId = [];

		for (let i = 0; i < selectedOption.length; i++) {
			let { value, id } = selectedOption[i]
			if (value === 'student_name' || value === 'school_name' ||
				value === 'section_name' || value === 'grade_level') {
				group = value;
				groupId.push(id);
			}
			if (value === 'attendance' || value === 'student_grades') {
				category = value;
			}
		}

		return fetch(`/report/group=${group}&${group}_id=
			${groupId}&category=${category}&
			from_date=${minDate}&to_date=${maxDate}`,
			{
	      headers : { 
	        'Content-Type': 'application/json',
	        'Accept': 'application/json'
      	},
      })
			.then((response) => response.json())
			.then((json) => json)
			.catch((err) => {
				// TODO: Make error handling for client
				console.error('Looks like there was an error on our end, please try again later');
			});
	}
	
	validateQuery = () => {
		const { selectedOption } = this.state;
		
		let partOne = false;
		let partTwo = false;

		for (let i = 0; i < selectedOption.length; i++) {
			let { value } = selectedOption[i];
			if (value === 'student_name' || value === 'school_name' ||
					value === 'section_name' || value === 'grade_level') {
				partOne = true;
			}
			if (value === 'student_grades' || value === 'attendance') {
				partTwo = true;
			}
		}

		return partOne && partTwo ? false : true;
	}

	render() {
		const { selectedOption, minDate, maxDate } = this.state;
		const isDisabled = this.validateQuery();
		const { schoolFetch, gradeLevelFetch, sectionFetch, studentFetch } = this.props;

		const allFetches = PromiseState.all([ schoolFetch, gradeLevelFetch, sectionFetch, studentFetch ]);

		let loaded = false;
		let pending = false;

		if (allFetches.pending) {
			pending = true;
		} else if (allFetches.fulfilled) {
			this.optionsGenerator('Grade Level', gradeLevelFetch.value.data, 'grade_level');
			this.optionsGenerator('Schools', schoolFetch.value.data, 'school_name');
			this.optionsGenerator('Sections', sectionFetch.value.data, 'section_name');
			this.optionsGenerator('Students', studentFetch.value.data, 'student_name');
			loaded = true;
		}

		return (
			<div>
				{!loaded && pending &&
					<div className="loading">
						<CircularProgress
							size={100}
							thickness={7}
						/>
					</div>
				}
				{
					loaded &&
					<form
						onSubmit={this.submitQuery}
						className="search-container"
					>
						<div className="inline-block dashboard-search">
							<Select
								loadOptions={this.loadOptions}
								multi
								noResultsText="Sorry, your request is invalid"
								onChange={this.handleChange}
								onValueClick={() => this.onValueClick()}
							  options={options}
							  required
								value={selectedOption}
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
						<h4>Please Select a Date Range</h4>
						<div>
			         <DatePicker
			           onChange={this.handleChangeMinDate}
			           autoOk
			           floatingLabelText="Min Date"
			           defaultDate={minDate}
			           locale="en-US"
			           floatingLabelStyle={{ zIndex: 0 }}
			         />
			         <DatePicker
			           onChange={this.handleChangeMaxDate}
			           autoOk
			           floatingLabelText="Max Date"
			           defaultDate={maxDate}
			           locale="en-US"
			           floatingLabelStyle={{ zIndex: 0 }}
			         />
						</div>
					</form>
				}
			</div>
		);
	}
}

export default SearchBar;
