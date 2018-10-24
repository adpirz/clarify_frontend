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
    width: '18%',
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
  routeElement: {
    fontSize: fontSizes.small,
  },
  divider: {
    width: '75%',
    textAlign: 'right',
  },
  heading: {
    fontSize: fontSizes.medium,
    margin: '0',
    fontWeight: '400',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '10px',
  },
  searchIndicator: {
    width: '20%',
    textAlign: 'center',
  },
  searchInput: {
    width: '80%',
  }
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
        <h2>Home</h2>
        <h2>Reminders</h2>
        <hr style={styles.divider}/>
        <h3 style={styles.heading}>My Students ({students.length})</h3>
        <div style={styles.studentList}>
          <div style={styles.searchContainer}>
            <i style={styles.searchIndicator} className="fas fa-search"/>
            <input style={styles.searchInput} type='text' placeholder="Search" onChange={this.handleSearch}></input>
          </div>
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
