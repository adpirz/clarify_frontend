import _ from 'lodash';
import React from 'react';
import Select, { components, createFilter } from 'react-select';
import * as Animated from 'react-select/lib/animated';
import styled from 'styled-components';
import { lighten } from 'polished';

import { DataConsumer } from '../../DataProvider';
import { Button, Error } from '../PatternLibrary';

/*
TODO: The following
- Style multivalue labels
- Activate and deactivate search button when appropriate
- Clean up buttons
*/
const groupStyles = {
  display: 'flex',
  color: '#707070',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontweight:'bold',
  fontSize: 18,
  height: '100%',
  borderBottom: `1px solid ${lighten(0.85, 'black')}`
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
const stringify = option => {
  const { data: { tags } } = option;
  const tagString = tags ? tags.join(' ') : '';
  return `${option.label} ${option.value} ${tagString}`
}

const Option = (props) => {
  const { data: { tags } } = props

  const Footer = styled.div`
    background-color: ${lighten(0.99, 'black')};
    color: ${lighten(0.6, 'black')};
    font-size: 11px;
    width: 100%;
    padding: 5px 15px;
    box-shadow: inset 0px 2px 4px 0px ${lighten(0.9, 'black')};
  `

  return (
  <div>
    <components.Option {...props}/>
    {tags ? (<Footer>{tags.join(' | ')}</Footer>) : null }
  </div>
  )
}

const reactSelectOptions = [
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
  }
];

class ReportQueryBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOptions: [],
      errorMessage: null,
      menuIsOpen: undefined,
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

  clearSelectOptions = () => {
    _.map(reactSelectOptions, (optionGroup) => {
      if (optionGroup.type === 'group') {
        optionGroup.options = [];
      }
    })
  }

  handleChange = (selectedOptions, action) => {
    this.setState((prevState) => {
      const isValidQuery = this.isValidQuery(selectedOptions);
      return {
        selectedOptions,
        errorMessage: isValidQuery ? "" : prevState.error,
        menuIsOpen: isValidQuery ? undefined : true,
      }
    });
  };

  handleBlur = () => this.setState(()=> ({menuIsOpen: undefined}))

  isMenuOpen = isOpen => isOpen ? true : undefined;

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
      if(groupElement.tags) optionsArray.tags = groupElement.tags;

      if (typeof targetQueryOptionsGroup !== 'undefined') {
        targetQueryOptionsGroup.options.push(optionsArray);
      }
    });
  }

  submitQuery = (e) => {
    e.preventDefault();
    if(!this.isValidQuery(this.state.selectedOptions)) {
      this.setState({errorMessage: `Try typing "attendance" and a student's name in the search bar.`});
      return;
    }
    const { selectedOptions } = this.state;

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
    const { selectedOptions, menuIsOpen } = this.state;

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

    /*
      See here: https://deploy-preview-2289--react-select.netlify.com/styles

      Short version: react-select v2.0 takes a singular 'styles' props object
      that defines styles across different pieces: container, menu, valueContainer,
      etc. Full list can be found at the link above. Each key on object represents
      the element to style and takes a function that passes params 'base' and 'state';
      'base' is a set of default style elements, so you can spread those and change
      just what you like per element.
    */
   const FONT_SIZE = '1.1em';

    const fontSizerMaker = (fontSize) => {
      return (base, state) => ({...base, fontSize})
    };

    const fontSizer = fontSizerMaker(FONT_SIZE)

    const styles = {
      container: (base, state) => ({
        ...base,
        ...borderStyles,
        width: "80%"
      }),
      menu: (base, state) => ({
        ...base,
        zIndex: 10
      }),
      input: fontSizer,
      valueContainer: fontSizer,
      multiValueLabel: fontSizer,
      multiValue: fontSizer
    }
    return (
      <div style={{backgroundColor: 'white'}}>
        <form>
          <div style={{
              display: 'flex',
              margin: '20px 25px',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Select
              isMulti
              backspaceRemovesValue
              components={{...Animated, Option}}
              placeholder="Start typing the name of a student, section etc..."
              onChange={this.handleChange}
              options={groupOptions}
              formatGroupLabel={formatGroupLabel}
              filterOption={createFilter({stringify})}
              menuIsOpen={menuIsOpen}
              onBlur={this.handleBlur}
              value={selectedOptions}
              styles={styles}
              style={this.state.error ? {border: 'none'} : null}
            />
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
