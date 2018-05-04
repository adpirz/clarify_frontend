import _ from 'lodash';
import React from 'react';
import Select from 'react-select-plus';
import { DatePicker, RaisedButton } from 'material-ui';
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
    ],
  },
];

const floatingLabelStyle = {
  zIndex: 0,
  fontFamily: 'Tajawal',
  fontSize: '18px',
};

const inputStyle = {
  letterSpacing: '1px',
  fontFamily: 'Tajawal',
  fontSize: '22.5px',
};

const submitLabelStyle = {
  fontFamily: 'Tajawal',
  textTransform: 'Capitalize',
  letterSpacing: '1px',
  fontSize: '18px',
}

class ReportQueryBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOptions: [],
      minDate: this.getBeginningOfSchoolYear(),
      maxDate: '',
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

  // If it's before January 1, get august 1 of that year.
  // If it's after January 1, get august 1 of the previous year.
  getBeginningOfSchoolYear = () => {
    const currentDate = new Date();
    // 0 == January and 7 == august
    if (0 < currentDate.month < 7) {
      // The beginning of the school year is the previous calendar years august 1st
      return new Date(currentDate.getFullYear() - 1, 7);
    } else {
      return new Date(currentDate.getFullYear(), 7);
    }
  }

  submitQuery = () => {
    const { lazyReportDataGet } = this.props;
    const { selectedOptions } = this.state;
    let { minDate, maxDate } = this.state;

    let group;
    let category;

    minDate = minDate.toISOString();
    maxDate = (maxDate === '') ? '' : maxDate.toISOString();

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

    lazyReportDataGet(group, groupId, category, minDate, maxDate);
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
    } = this.state;

    const isDisabled = this.isInvalidQuery();

    let groupOptions = reactSelectOptions;

    if (selectedOptions.length) {
      let isGroupSelected = false;
      let isCategorySelected = false;

      selectedOptions.forEach(option => {
        const { group: { type } } = option;

        if (this.isGroupValue(type)) {
          isGroupSelected = true;
        }

        if (this.isCategoryValue(type)) {
          isCategorySelected = true;
        }
      });

      if (isCategorySelected && isGroupSelected) {
        groupOptions = [];
      } else if (isGroupSelected) {
        groupOptions = reactSelectOptions.filter((o) => o.type === 'category');
      } else {
        groupOptions = reactSelectOptions.filter((o) => o.type === 'group');
      }
    }

    return (
      <div>
        <form
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
            <RaisedButton
              label="Search"
              primary
              className="btn"
              labelStyle={submitLabelStyle}
              disabledLabelColor={'#fff'}
              disabled={isDisabled}
              onClick={() => this.submitQuery()}
            />
          </div>
          <div>
            <RaisedButton
              label="Search"
              primary
              className="mobileBtn"
              fullWidth
              labelStyle={submitLabelStyle}
              disabledLabelColor={'#fff'}
              disabled={isDisabled}
              onClick={() => this.submitQuery()}
            />
          </div>
          <div className="dateHeader">
            Please Select a Date Range
          </div>
          <div>
            <DatePicker
              onChange={this.handleChangeMinDate}
              autoOk
              floatingLabelText="From Date *"
              defaultDate={minDate}
              locale="en-US"
              floatingLabelStyle={floatingLabelStyle}
              className="datePicker"
              inputStyle={inputStyle}
            />
            <DatePicker
              onChange={this.handleChangeMaxDate}
              autoOk
              floatingLabelText="To Date (empty signifies to-date)"
              locale="en-US"
              floatingLabelStyle={floatingLabelStyle}
              className="datePicker"
              inputStyle={inputStyle}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default ReportQueryBuilder;
