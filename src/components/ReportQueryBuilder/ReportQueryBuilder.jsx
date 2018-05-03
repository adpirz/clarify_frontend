import React from 'react';
import Select from 'react-select-plus';
import { DatePicker } from 'material-ui';
import _ from 'lodash';
import 'react-select-plus/dist/react-select-plus.css';

import './styles.css';

const reactSelectOptions = [
  {
    label: 'Students',
    options: [],
    type: 'group',
    value: 'student',
  },
  {
    label: 'Sections',
    options: [],
    type: 'group',
    value: 'section',
  },
  {
    label: 'Sites',
    options: [],
    type: 'group',
    value: 'site',
  },
  {
    label: 'Grade Level',
    options: [],
    type: 'group',
    value: 'grade_level',
  },
  {
    label: 'Categories',
    type: 'category',
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
    const pastYear = minDate.getFullYear() - 1;
    minDate.setFullYear(pastYear);
    const maxDate = new Date();

    this.state = {
      selectedOptions: [],
      minDate,
      maxDate,
    };
  }

  componentWillMount() {
    const {
      gradeLevels,
      sites,
      sections,
      students,
    } = this.props;

    if (gradeLevels.length && sites.length && sections.length && students.length) {
      this.optionsGenerator(gradeLevels, 'grade_level');
      this.optionsGenerator(sites, 'site');
      this.optionsGenerator(sections, 'section');
      this.optionsGenerator(students, 'student');
    }
  }

  handleChangeMinDate = (event, date) => {
    this.setState({ minDate: date });
  };

  handleChangeMaxDate = (event, date) => {
    this.setState({ maxDate: date });
  };

  handleChange = (selectedOptions) => {
    this.setState({ selectedOptions });
  };

  handleGroupFilter = (filterGroup) => {
    return reactSelectOptions.filter((o) => {
      let { label, type } = o;
      if (type === 'group') {
        label = label.toLowerCase();
        if (label.includes(filterGroup)) {
          return o;
        }
      } else {
        return o;
      }
      return o;
    });
  };

  handleGroupCategoryFilter = (filterGroup) => {
    return reactSelectOptions.filter((o) => {
      let { label } = o;
      label = label.toLowerCase();
      if (label.includes(filterGroup)) {
        return o;
      }
      return o
    });
  };

  isGroupValue = (type) => type === 'group';

  isCategoryValue = (type) => type === 'category';

  optionsGenerator = (dataArray, optionValue) => {
    const targetQueryOptionsGroup = _.find(reactSelectOptions, { value: optionValue });

    dataArray.forEach((dataObj) => {
      let name;
      switch (optionValue) {
        case 'section':
          name = dataObj.section_name;
          break;
        case 'site':
          name = dataObj.site_name;
          break;
        case 'grade_level':
          name = dataObj.long_name;
          break;
        default:
          name = `${dataObj.first_name} ${dataObj.last_name}`;
      }
      let optionsArray = {
        label: name,
        value: optionValue,
        id: dataObj.id,
      }
      if (typeof targetQueryOptionsGroup !== 'undefined') {
        targetQueryOptionsGroup.options.push(optionsArray);
      }
    });
  }

  submitQuery = (e) => {
    e.preventDefault();
    const { submitReportQuery } = this.props;
    const { selectedOptions } = this.state;
    let { minDate, maxDate } = this.state;

    let group;
    let category;

    minDate = minDate.toISOString();
    maxDate = maxDate.toISOString();

    let groupId = [];

    selectedOptions.forEach(option => {
      const { id, group: { type, value } } = option;

      if (this.isGroupValue(type)) {
        group = value;
        groupId.push(id);
      }

      if (this.isCategoryValue(type)) {
        category = option.value;
      }
    });

    submitReportQuery(group, groupId, category, minDate, maxDate);
  };

  isInvalidQuery = () => {
    const { selectedOptions } = this.state;
    const groupQuerySelected = !!_.find(selectedOptions, { group: { type: 'group' } });
    const categoryQuerySelected = !!_.find(selectedOptions, { group: { type: 'category' } });
    return !(groupQuerySelected && categoryQuerySelected);
  };

  render() {
    const {
      selectedOptions,
      minDate,
      maxDate,
    } = this.state;

    const isDisabled = this.isInvalidQuery();

    let groupOptions = reactSelectOptions;

    let filterGroup = '';

    if (selectedOptions.length) {
      let isGroupSelected = false;
      let isCategorySelected = false;

      selectedOptions.forEach(option => {
        const { group: { type, value } } = option;

        if (this.isGroupValue(type)) {
          isGroupSelected = true;
          filterGroup = value;
        }

        if (this.isCategoryValue(type)) {
          isCategorySelected = true;
        }
      });

      if (isCategorySelected && isGroupSelected) {
        groupOptions = this.handleGroupCategoryFilter(filterGroup);
      } else if (isGroupSelected) {
        groupOptions = this.handleGroupFilter(filterGroup);
      } else {
        groupOptions = reactSelectOptions.filter((o) => o.type !== 'category');
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
              value={selectedOptions}
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
