import React from 'react';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { DataConsumer } from '../../../DataProvider';

import { Loading } from '..';

import {
  colors,
  fontSizes,
} from '../constants';

const styles = {
  leftNavigation: {
    maxWidth: '22.5%',
    backgroundColor: colors.backgroundAccent,
    padding: '10px',
    minHeight: '97.5vh'
  },
  studentRow: {
    display: 'block',
    margin: '12px 0',
    color: colors.textGrey,
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  heading: {
    fontSize: fontSizes.large,
    margin: '0',
    fontWeight: '400',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: '10px',
  },
  studentList: {
    marginLeft: '20px',
  },
}


class LeftNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredStudents: props.students,
    }
  }

  handleSearch = (e) => {
    const needle = e.target.value.toLowerCase();
    const filteredStudents = filter(this.props.students, (s) => {
      const firstNameHit = s.first_name.toLowerCase().indexOf(needle) > -1
      const lastNameHit = s.last_name.toLowerCase().indexOf(needle) > -1
      return firstNameHit || lastNameHit;
    })
    this.setState({filteredStudents});
  }

  render() {

    const { students } = this.props;
    if (!students || !students.length) {
      return (
        <Loading />
      );
    }

    const {filteredStudents} = this.state;
    return (
      <nav style={styles.leftNavigation}>
        <h3 style={styles.heading}>My Students</h3>
        <div style={styles.searchContainer}>
          <i className="fas fa-search"/>
          <input type='text' placeholder="Search" onChange={this.handleSearch}></input>
        </div>
        <div style={styles.studentList}>
          {map(filteredStudents, (s) => {
            return (
              <span key={s.id} style={styles.studentRow}>{s.last_name}, {s.first_name}</span>
            );
          })}
        </div>
      </nav>
    )
  }
}


export default props => (
  <DataConsumer>
    {({students}) => (
      <LeftNavigation
        students={students}
        {...props}
      />
    )}
  </DataConsumer>
);
