import React from 'react';
import Select from 'react-select-plus';
import { DatePicker } from 'material-ui';
import 'react-select-plus/dist/react-select-plus.css';

import './styles.css';

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
		};
	}

	handleChangeMinDate = (event, date) => {
	  this.setState({ minDate: date });
	};

	handleChangeMaxDate = (event, date) => {
	  this.setState({ maxDate: date });
	};

	handleChange = (selectedOption) => {
		this.setState({ selectedOption });
	};

	handleGroupFilter = (filterGroup, options) => {
		return options.filter((o) => {
			let { label } = o;
			if (label === 'Schools' || label === 'Sections' ||
				label === 'Students' || label === 'Grade Level')  {
				label = label.toLowerCase();
				if (label.includes(filterGroup)) {
					return o;
				}
			}
			if (label === 'Categories') {
				return o;
			}
			return null;
		});
	};

	handleGroupCategoryFilter = (filterGroup, options) => {
		return options.filter((o) => {
			let { label } = o;
			label = label.toLowerCase();
			if (label.includes(filterGroup)) {
				return o;
			}
			return null;
		});
	};

	formatValue = (value) => {
		let splitValue = value.split('_');
		return (value !== 'attendance') ? `${splitValue[0]}_${splitValue[1]}` : 'attendance';
	};

	checkGroupValue = (value) => {
		return (value === 'student_name' || value === 'school_name' ||
					value === 'section_name' || value === 'grade_level');
	};

	checkCategoryValue = (value) => (value === 'student_grades' || value === 'attendance');

	submitQuery = (e) => {
		e.preventDefault();
		const { submitReportQuery } = this.props;
		const { selectedOption, minDate, maxDate } = this.state;

		let group;
		let category;

		let groupId = [];

		selectedOption.forEach(option => {
			let { value, id } = option;
			value = this.formatValue(value);

			if (this.checkGroupValue(value)) {
				group = value;
				groupId.push(id);
			}

			if (this.checkCategoryValue(value)) {
				category = value;
			}
		});

		submitReportQuery(group, groupId, category, minDate, maxDate);
	};
	
	validateQuery = () => {
		const { selectedOption } = this.state;

		let partOne = false;
		let partTwo = false;

		selectedOption.forEach((option) => {
			let { value } = option;
			value = this.formatValue(value);

			if (this.checkGroupValue(value)) {
				partOne = true;
			}

			if (this.checkCategoryValue(value)) {
				partTwo = true;
			}
		});

		return partOne && partTwo ? false : true;
	};

	render() {
		const { selectedOption, minDate, maxDate } = this.state;
		const { options } = this.props;
		const isDisabled = this.validateQuery();

		let groupOptions = options;

		let filterGroup = '';

		if (selectedOption.length) {
			let group = false;
			let category = false;

			selectedOption.forEach(option => {
				let { value } = option;
				value = this.formatValue(value);
				
				if (this.checkGroupValue(value)) {
					group = true;
					filterGroup = value.split('_')[0];
				}
				
				if (this.checkCategoryValue(value)) {
					category = true;
				}
			});

			if (category && group) {
				let filtered = this.handleGroupCategoryFilter(filterGroup, options);
				groupOptions = filtered;
			} else if (group) {
				let filtered = this.handleGroupFilter(filterGroup, options);
				groupOptions = filtered;
			} else {
				let filtered = options.filter((o) => o.label !== 'Categories');
				groupOptions = filtered;
			}
		}

		return (
			<div>
				<form
					onSubmit={this.submitQuery}
					className="search-container"
				>
					<div className="inline-block dashboard-search">
						<Select
							multi
							noResultsText="Sorry, your request is invalid"
							onChange={this.handleChange}
						  options={groupOptions}
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
			</div>
		);
	}
}

export default SearchBar;
