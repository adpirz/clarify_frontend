import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import Select from 'react-select-plus';
import { DataConsumer } from '../../DataProvider';
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
      errorMessage: "",
    };
  }

  componentWillMount() {
    const {
      gradeLevels,
      sites,
      sections,
      students,
    } = this.props;
    if (students && sections && gradeLevels && sites) {
      this.generateOptions(students, sections, gradeLevels, sites);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      students: newStudents,
      sections: newSections,
      gradeLevels: newGradeLevels,
      sites: newSites,
    } = nextProps;
    const {
      students: oldStudents,
      sections: oldSections,
      gradeLevels: oldGradeLevels,
      sites: oldSites,
    } = this.props;

    if ((!oldStudents && newStudents) && (!oldSections && newSections) &&
        (!oldGradeLevels && newGradeLevels) && (!oldSites && newSites)) {
          this.generateOptions(newStudents, newSections, newGradeLevels, newSites);
        }
  }

  generateOptions = (students, sections, gradeLevels, sites) => {
    this.clearSelectOptions();
    this.optionsGenerator(students, 'student');
    this.optionsGenerator(sections, 'section');
    this.optionsGenerator(gradeLevels, 'grade_level');
    this.optionsGenerator(sites, 'site');
  }

  handleChangeMinDate = (event, date) => {
    this.setState({ minDate: date });
  };

  handleChangeMaxDate = (event, date) => {
    this.setState({ maxDate: date });
  };

  clearSelectOptions = () => {
    _.map(reactSelectOptions, (optionGroup) => {
      if (optionGroup.type === 'group') {
        optionGroup.options = [];
      }
    })
  }

  handleChange = (selectedOptions) => {
    this.setState((prevState) => {
      return {
        selectedOptions,
        errorMessage: this.isValidQuery(selectedOptions) ? "" : prevState.error,
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
        value: `${optionValue}_${dataObj.id}`,
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
    if(!this.isValidQuery(this.state.selectedOptions)) {
      this.setState({errorMessage: `Try typing "attendance" and a student's name in the search bar.`});
      return;
    }
    const { selectedOptions, minDate, maxDate } = this.state;

    let group;
    let category;

    const momentMin = moment(minDate).format('YYYY-MM-DD');

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

    let queryString = `group=${group}&group_id=${groupId}&category=${category}&from_date=${momentMin}`;
    if (maxDate) {
      queryString += `&to_date=${moment(maxDate).format('YYYY-MM-DD')}`;
    }
    this.props.submitReportQuery(queryString);
  };

  isValidQuery = (selectedOptions) => {
    const groupQuerySelected = !!_.find(selectedOptions, { group: { type: 'group' } });
    const categoryQuerySelected = !!_.find(selectedOptions, { group: { type: 'category' } });
    return groupQuerySelected && categoryQuerySelected;
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

    let borderStyles = null;
    if (this.state.error) {
      borderStyles = {
        border: '2px solid #FDA428',
        borderRadius: '6px',
      };
    }

    return (
      <div style={{backgroundColor: 'white'}}>
        <form>
          <div style={{
              display: 'flex',
              margin: '0 25px',
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
              wrapperStyle={{width: "50%", ...borderStyles}}
              menuContainerStyle={{zIndex: 10}}
              style={this.state.error ? {border: 'none'} : null}
            />
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '0 auto'}}>
              <DatePicker
                onChange={this.handleChangeMinDate}
                autoOk
                floatingLabelText="From Date *"
                defaultDate={minDate}
                locale="en-US"
                style={{display: 'inline-block', margin: '0 20px'}}
              />
              <DatePicker
                onChange={this.handleChangeMaxDate}
                autoOk
                floatingLabelText="To Date (empty signifies to-date)"
                locale="en-US"
                style={{display: 'inline-block', margin: '0 20px'}}
              />
            </div>
          </div>
          <Error>
            {this.state.errorMessage}
          </Error>
          <Button
            primary
            onClick={this.submitQuery}
            style={{width: '250px', margin: '15px auto'}}>
            Search
          </Button>
        </form>
      </div>
    );
  }
}

export default props => (
  <DataConsumer>
    {({students, sections, gradeLevels, sites, submitReportQuery}) => (
      <ReportQueryBuilder
        students={students}
        sections={sections}
        gradeLevels={gradeLevels}
        sites={sites}
        submitReportQuery={submitReportQuery}
        {...props}
      />
    )}
  </DataConsumer>
);
