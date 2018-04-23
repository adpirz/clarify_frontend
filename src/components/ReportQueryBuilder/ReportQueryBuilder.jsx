import React from 'react';
import Select from 'react-select-plus';
import { DatePicker } from 'material-ui';
import 'react-select-plus/dist/react-select-plus.css';

import './styles.css';

const reactSelectOptions = [
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
    label: 'Categories',
    options: [
      {
        label: 'Attendance',
        value: 'attendance',
        id: 999,
      },
      {
        label: 'Academic Grades',
        value: 'grades',
        id: 1000,
      }
    ],
  },
];

class ReportQueryBuilder extends React.Component {
  constructor(props) {
    super(props);
    const minDate = new Date();
    const maxDate = new Date();

    minDate.setFullYear(minDate.getFullYear()); // TODO: get start of school year date from DB
    maxDate.setFullYear(maxDate.getFullYear());

    this.state = {
      selectedOption: [],
      minDate: minDate,
      maxDate: maxDate,
    };
  }

  componentWillMount() {
    const {
      gradeLevels,
      schools,
      sections,
      students,
    } = this.props;

    if (gradeLevels.length && schools.length && sections.length && students.length) {
      this.optionsGenerator('Grade Level', gradeLevels, 'grade_level');
      this.optionsGenerator('Schools', schools, 'school');
      this.optionsGenerator('Sections', sections, 'section');
      this.optionsGenerator('Students', students, 'student');
    }
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

  handleGroupFilter = (filterGroup) => {
    return reactSelectOptions.filter((o) => {
      let { label } = o;
      if (label === 'Schools' || label === 'Sections' ||
        label === 'Students' || label === 'Grade Level') {
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

  handleGroupCategoryFilter = (filterGroup) => {
    return reactSelectOptions.filter((o) => {
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
    return (splitValue.length === 3) ? `${splitValue[0]}_${splitValue[1]}` : splitValue[0];
  };

  checkGroupValue = (value) => {
    return (value === 'student' || value === 'school' ||
      value === 'section' || value === 'grade_level');
  };

  checkCategoryValue = (value) => (value === 'grades' || value === 'attendance');

  optionsGenerator = (labelString, dataArray, optionValue) => {
    let index;
    for (let i = 0; i < reactSelectOptions.length; i++) {
      if (reactSelectOptions[i].label === labelString) {
        index = i;
      }
    }

    dataArray.forEach((dataObj, i) => {
      let optionsArray = {
        label: dataObj.name,
        value: `${optionValue}_${i}`,
        id: dataObj.id,
      }
      if (typeof index !== 'undefined') {
        reactSelectOptions[index].options.push(optionsArray);
      }
    });
  }

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

    let groupQuerySelected = false;
    let categoryQuerySelected = false;

    selectedOption.forEach((option) => {
      let { value } = option;
      value = this.formatValue(value);

      if (this.checkGroupValue(value)) {
        groupQuerySelected = true;
      }

      if (this.checkCategoryValue(value)) {
        categoryQuerySelected = true;
      }
    });

    return groupQuerySelected && categoryQuerySelected ? false : true;
  };

  render() {
    const {
      selectedOption,
      minDate,
      maxDate,
    } = this.state;

    const isDisabled = this.validateQuery();

    let groupOptions = reactSelectOptions;

    let filterGroup = '';

    if (selectedOption.length) {
      let isGroupSelected = false;
      let isCategorySelected = false;

      selectedOption.forEach(option => {
        let { value } = option;
        value = this.formatValue(value);

        if (this.checkGroupValue(value)) {
          isGroupSelected = true;
          filterGroup = value.split('_')[0];
        }

        if (this.checkCategoryValue(value)) {
          isCategorySelected = true;
        }
      });

      if (isCategorySelected && isGroupSelected) {
        const filtered = this.handleGroupCategoryFilter(filterGroup);
        groupOptions = filtered;
      } else if (isGroupSelected) {
        const filtered = this.handleGroupFilter(filterGroup);
        groupOptions = filtered;
      } else {
        const filtered = reactSelectOptions.filter((o) => o.label !== 'Categories');
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

export default ReportQueryBuilder;
