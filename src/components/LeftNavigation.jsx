import React from 'react';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { NavLink } from 'react-router-dom'
import styled from 'styled-components';

import { DataConsumer } from '../DataProvider';

import { Loading } from './PatternLibrary';

import {
  colors,
  fontSizes,
  layout,
} from './PatternLibrary/constants';

const INDENT = '20';

const Nav = styled.nav`
  width: ${layout.leftNavWidth};
  background-color: ${colors.backgroundAccent};
  position: absolute;
  top: calc(${layout.siteNavHeight} + 20px);
  bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const RouteElement = styled(NavLink)`
  font-size: ${fontSizes.medium};
  font-weight: 400;
  display: block;
  padding: 5px 0px;
  margin: 15px 20px 15px 0px;
  border-radius: 0px 15px 15px 0px;
  text-decoration: none;
  color: ${colors.textGrey};
  padding-left: ${INDENT}px;
`;

const ActiveElementStyle = {
  backgroundColor: colors.lilacAccent,
};

const Divider = styled.hr`
  width: 75%;
  margin: 10px 0 10px auto;
  border: .5px solid ${colors.borderGrey};
`;

const StudentSection = styled.section`
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h3`
  font-size: ${fontSizes.medium};
  margin: 0 0 0 ${INDENT}px;
  font-weight: 400;
`;

const SearchContainer = styled.div`
  padding: 10px 0px 10px ${INDENT}px;
`;

const SearchIndicator = styled.i`
  margin-right: 10px;
`;

const StudentList = styled.div`
  overflow: scroll;
`;

const StudentRow = styled(NavLink)`
  padding: 5px 0px 5px ${2*INDENT}px;
  display: block;
  color: ${colors.textGrey};
  margin: 6px 20px 6px 0px;
  border-radius: 0px 15px 15px 0px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
`;

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
      <Nav>
        <section>
          <RouteElement
            to='/'
            activeStyle={ActiveElementStyle}
            exact>
            Home
          </RouteElement>
          <RouteElement
            exact
            activeStyle={ActiveElementStyle}
            to='/reminders'>
            Reminders
          </RouteElement>
          <Divider />
        </section>
        <StudentSection>
          <Heading>My Students ({students.length})</Heading>
          <SearchContainer>
            <SearchIndicator className="fas fa-search" />
            <input type='text' placeholder="Search" onChange={this.handleSearch}></input>
          </SearchContainer>
          <StudentList>
            {map(filteredStudents, (s) => {
              return (
                <StudentRow
                  key={s.id}
                  activeStyle={ActiveElementStyle}
                  to={`/student/${s.id}`}>
                  {s.last_name}, {s.first_name[0]}
                </StudentRow>
              );
            })}
          </StudentList>
        </StudentSection>
      </Nav>
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
