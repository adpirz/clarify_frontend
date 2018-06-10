import _ from 'lodash';
import React from 'react';
import Select from 'react-select';
import { lighten } from 'polished';

import { DataConsumer } from '../../DataProvider';
import { Button, Error } from '../PatternLibrary';
import { DatePicker } from 'material-ui';


const groupStyles = {
  display: 'flex',
  color: '#707070',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontweight:'bold',
  fontSize: 18,
  height: '100%'
};
const groupBadgeStyles = {
  backgroundColor: lighten(0.65, '#7f600c'),
  borderRadius: '2em',
  color: '#7f600c',
  display: 'inline',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  margin: '0 0.8em',
  textAlign: 'center',
};

const formatGroupLabel = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    {data.options.length > 1 ? 
      (<span style={groupBadgeStyles}>{data.options.length}</span>) : null
    }
  </div>
);

const reactSelectOptions = [
  {
    label: 'Grade Level',
    options: [],
    type: 'group',
    value: 'grade_level',
  },
  {
    label: 'Sections',
    options: [],
    type: 'group',
    value: 'section',
  },
  {
    label: 'Students',
    options: [],
    type: 'group',
    value: 'student',
  },
  {
    label: 'Categories',
    type: 'reportType',
    options: [
      {
        label: 'Attendance',
        value: 'attendance',
        type: 'reportType',
        id: 999,
      },
      {
        label: 'Grades',
        value: 'grades',
        type: 'reportType',
        id: 998,
      },
    ],
  },
];

class ReportQueryBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOptions: [],
      fromDate: this.getBeginningOfSchoolYear(),
      toDate: null,
      errorMessage: null,
    };
  }

  componentWillMount() {
    const {
      gradeLevels,
      sections,
      students,
    } = this.props;
    if (students && sections && gradeLevels) {
      this.generateOptions(students, sections, gradeLevels);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      students: newStudents,
      sections: newSections,
      gradeLevels: newGradeLevels,
    } = nextProps;
    const {
      students: oldStudents,
      sections: oldSections,
      gradeLevels: oldGradeLevels,
    } = this.props;

    if (!(oldStudents && oldSections && oldGradeLevels)
        && (newStudents && newSections && newGradeLevels)) {
          this.generateOptions(newStudents, newSections, newGradeLevels);
        }
  }

  generateOptions = (students, sections, gradeLevels) => {
    this.clearSelectOptions();
    this.optionsGenerator(students, 'student');
    this.optionsGenerator(sections, 'section');
    this.optionsGenerator(gradeLevels, 'grade_level');
  }

  handleChangeFromDate = (event, date) => {
    this.setState({ fromDate: date });
  };

  handleChangeToDate = (event, date) => {
    this.setState({ toDate: date });
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

  isReportTypeValue = (type) => type === 'reportType';

  optionsGenerator = (groupList, optionValue) => {
    const targetQueryOptionsGroup = _.find(reactSelectOptions, { value: optionValue });

    groupList.forEach((groupElement) => {
      let name;
      switch (optionValue) {
        case 'section':
          name = groupElement.section_name;
          break;
        case 'site':
          name = groupElement.site_name;
          break;
        case 'grade_level':
          name = groupElement.long_name;
          break;
        default:
          if (!groupElement.is_enrolled) {
            return;
          }
          name = `${groupElement.first_name} ${groupElement.last_name}`;
      }
      let optionsArray = {
        label: name,
        value: `${optionValue}_${groupElement.id}`,
        id: groupElement.id,
        type: 'group',
        group_value: optionValue
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
    const { selectedOptions, fromDate, toDate } = this.state;

    let group;
    let reportType;

    let groupId = '';

    selectedOptions.forEach(option => {
      const { id, type, group_value } = option;

      if (this.isGroupValue(type)) {
        group = group_value;
        groupId = id;
      }

      if (this.isReportTypeValue(type)) {
        reportType = option.value;
      }
    });

    const reportParameters = {
      group,
      groupId,
      reportType,
      fromDate,
      toDate,
    };

    const queryString = this.props.generateReportQuery(reportParameters)
    this.props.getNewBaseReport(queryString);
  };

  isValidQuery = (selectedOptions) => {
    const groupQuerySelected = !!_.find(selectedOptions, { type: 'group' });
    const reportTypeQuerySelected = !!_.find(selectedOptions, { type: 'reportType' });
    return groupQuerySelected && reportTypeQuerySelected;
  };

  render() {
    const { fromDate, selectedOptions } = this.state;

    let groupOptions = reactSelectOptions;

    if (selectedOptions.length) {
      let isGroupSelected = false;
      let isReportTypeSelected = false;

      selectedOptions.forEach(option => {
        const { type } = option;

        if(!isGroupSelected) isGroupSelected = this.isGroupValue(type);
        if(!isReportTypeSelected) isReportTypeSelected = this.isReportTypeValue(type);

      });

      if (isReportTypeSelected && isGroupSelected) {
        groupOptions = [];
      } else if (isGroupSelected) {
        groupOptions = reactSelectOptions.filter((o) => o.type === 'reportType');
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

    const styles = {
      container: (base, state) => ({
        ...base,
        ...borderStyles,
        width: "30%"
      }),
      menu: (base, state) => ({
        ...base,
        zIndex: 10
      })
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
              isMulti
              backspaceRemovesValue
              placeholder="Start typing the name of a student, section etc..."
              onChange={this.handleChange}
              options={groupOptions}
              formatGroupLabel={formatGroupLabel}
              value={selectedOptions}
              styles={styles}
              style={this.state.error ? {border: 'none'} : null}
            />
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '0 auto'}}>
              <DatePicker
                onChange={this.handleChangeFromDate}
                autoOk
                floatingLabelText="From Date *"
                defaultDate={fromDate}
                locale="en-US"
                style={{display: 'inline-block', margin: '0 20px'}}
              />
              <DatePicker
                onChange={this.handleChangeToDate}
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
            style={{width: '250px', margin: '15px auto', display: 'block'}}>
            Search
          </Button>
        </form>
      </div>
    );
  }
}

export default props => (
  <DataConsumer>
    {({
      students,
      sections,
      gradeLevels,
      getNewBaseReport,
      generateReportQuery,
      queryError,
    }) => (
      <ReportQueryBuilder
        students={students}
        sections={sections}
        gradeLevels={gradeLevels}
        getNewBaseReport={getNewBaseReport}
        generateReportQuery={generateReportQuery}
        queryError={queryError}
        {...props}
      />
    )}
  </DataConsumer>
);
