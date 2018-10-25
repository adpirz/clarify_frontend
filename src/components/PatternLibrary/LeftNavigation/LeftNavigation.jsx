import React from 'react';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { NavLink } from 'react-router-dom'

import { DataConsumer } from '../../../DataProvider';

import { Loading } from '..';

import {
  colors,
  fontSizes,
  layout,
} from '../constants';

const INDENT = '20';

const styles = {
  leftNavigation: {
    width: layout.leftNavWidth,
    backgroundColor: colors.backgroundAccent,
    position: 'absolute',
    top: `calc(${layout.siteNavHeight} + 20px)`,
    bottom: 0,
    overflow: 'hidden',
  },
  navSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  routeElement: {
    fontSize: fontSizes.medium,
    fontWeight: '400',
    display: 'block',
    padding: '5px 0px',
    margin: '15px 20px 15px 0px',
    borderRadius: '0px 15px 15px 0px',
    textDecoration: 'none',
    color: colors.textGrey,
    paddingLeft: `${INDENT}px`,
  },
  activeRouteElement: {
    backgroundColor: colors.lilacAccent,
  },
  divider: {
    width: '75%',
    margin: '10px 0 10px auto',
    border: `.5px solid ${colors.borderGrey}`,
  },
  studentSection: {
    height: '85%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: fontSizes.medium,
    margin: `0 0 0 ${INDENT}px`,
    fontWeight: '400',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: `10px 0px 10px ${INDENT}px`,
  },
  searchIndicator: {
    marginRight: '10px',
  },
  studentList: {
    overflow: 'scroll',
  },
  studentRow: {
    padding: `5px 0px 5px ${2*INDENT}px`,
    display: 'block',
    color: colors.textGrey,
    margin: '12px 20px 12px 0px',
    borderRadius: '0px 15px 15px 0px',
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textDecoration: 'none',
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
        <section style={styles.navSection}>
          <NavLink
            to='/'
            exact
            style={styles.routeElement}
            activeStyle={styles.activeRouteElement}>
            Home
          </NavLink>
          <NavLink
            exact
            to='/reminders'
            style={styles.routeElement}
            activeStyle={styles.activeRouteElement}>
            Reminders
          </NavLink>
          <hr style={styles.divider}/>
        </section>
        <section style={styles.studentSection}>
          <h3 style={styles.heading}>My Students ({students.length})</h3>
          <div style={styles.searchContainer}>
            <i style={styles.searchIndicator} className="fas fa-search"/>
            <input style={styles.searchInput} type='text' placeholder="Search" onChange={this.handleSearch}></input>
          </div>
          <div style={styles.studentList}>
            {map(filteredStudents, (s) => {
              return (
                <NavLink
                  key={s.id}
                  style={styles.studentRow}
                  activeStyle={styles.activeRouteElement}
                  to={`/student/${s.id}`}>
                  {s.last_name}, {s.first_name[0]}
                </NavLink>
              );
            })}
          </div>
        </section>
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
