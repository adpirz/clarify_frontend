import _ from 'lodash';
import React from 'react';
import Select from 'react-select-plus';
import { Button, Error } from '../PatternLibrary';
import { DatePicker } from 'material-ui';
import 'react-select-plus/dist/react-select-plus.css';

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

class ReportQueryBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOptions: [],
      minDate: this.getBeginningOfSchoolYear(),
      maxDate: '',
      error: "",
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
    this.setState((prevState) => {
      return {
        selectedOptions,
        error: this.isInvalidQuery(selectedOptions) ? prevState.error : "",
      }
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

  submitQuery = (e) => {
    e.preventDefault();
    if(this.isInvalidQuery(this.state.selectedOptions)) {
      this.setState({
        error: "Query Invalid",
      });
      return;
    }
    const { submitReportQuery } = this.props;
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

    submitReportQuery(group, groupId, category, minDate, maxDate);
  };

  isInvalidQuery = (selectedOptions) => {
    const groupQuerySelected = !!_.find(selectedOptions, { group: { type: 'group' } });
    const categoryQuerySelected = !!_.find(selectedOptions, { group: { type: 'category' } });
    return !(groupQuerySelected && categoryQuerySelected);
  };

  render() {
    const {
      selectedOptions,
      minDate,
    } = this.state;



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
        <form>
          <div style={{
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Select
              multi
              placeholder="Start typing the name of a student, section etc..."
              noResultsText="Sorry, your request is invalid"
              onChange={this.handleChange}
              options={groupOptions}
              value={selectedOptions}
              wrapperStyle={{width: "30%"}}
              menuContainerStyle={{zIndex: 10}}
            />
            <Button
              primary
              onClick={this.submitQuery}>
              Search
            </Button>
          </div>
          <Error show={this.state.error}>
            {this.state.error}
          </Error>
          <span style={{width: '100%', display: 'block', textAlign: 'center'}}>
            Please Select a Date Range
          </span>
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '50%',
              margin: '0 auto'}}>
            <DatePicker
              onChange={this.handleChangeMinDate}
              autoOk
              floatingLabelText="From Date *"
              defaultDate={minDate}
              locale="en-US"
              style={{display: 'inline-block'}}
            />
            <DatePicker
              onChange={this.handleChangeMaxDate}
              autoOk
              floatingLabelText="To Date (empty signifies to-date)"
              locale="en-US"
              style={{display: 'inline-block'}}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default ReportQueryBuilder;
