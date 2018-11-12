import React from "react";
import map from "lodash/map";
import filter from "lodash/filter";
import findIndex from "lodash/findIndex";
import { NavLink, withRouter } from "react-router-dom";
import styled from "styled-components";
import { lighten, darken, desaturate } from "polished";

import { DataConsumer } from "../DataProvider";

import { Loading } from "./PatternLibrary";

import { colors, fontSizes, layout } from "./PatternLibrary/constants";

const SearchStyled = styled.input`
  padding: 2px 8px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  width: 85%;
  height: 42px;
  font-size: 1.1em;
  box-shadow: inset 1px 1px 1px 1px rgba(0, 0, 0, 0.1);

  &::placeholder {
    color: ${lighten(0.7, "black")};
  }
`;
const Nav = styled.nav`
  width: ${layout.leftNavWidth};
  background-color: ${colors.backgroundAccent};
  position: absolute;
  top: 0;
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
  padding-left: ${layout.indent}px;
`;

const ActiveElementStyle = {
  backgroundColor: colors.accent,
  color: colors.white,
  fontWeight: 600,
  textShadow: "1px 1px rgba(0,0,0,0.5)"
};

const Divider = styled.hr`
  width: 75%;
  margin: 10px 0 10px auto;
  border: 0.5px solid ${colors.borderGrey};
`;

const StudentSection = styled.section`
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h3`
  font-size: ${fontSizes.medium};
  margin: 0 0 0 ${layout.indent}px;
  font-weight: 400;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 10px 5px 10px ${layout.indent}px;
`;

const StudentList = styled.div`
  overflow: scroll;
`;

const highlightBackground = desaturate(0.17, darken(0.17, colors.accent));
const StudentRow = styled(NavLink)`
  padding: 5px 0px 5px ${2 * layout.indent}px;
  font-size: 1.1em;
  display: block;
  color: ${props => (props.highlight ? "white" : colors.textGrey)};
  margin: 7px 20px 7px 0px;
  border-radius: 0px 30px 30px 0px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  font-weight: ${props => (props.highlight ? 600 : 400)};
  text-shadow: ${props =>
    props.highlight ? "1px 1px 0px rgba(0, 0, 0, 0.3)" : "none"};
  background-color: ${props =>
    props.highlight ? highlightBackground : "none"};

  &:hover {
    background-color: ${highlightBackground};
    color: white;
  }
`;

const EnterSpan = () => (
  <span
    style={{
      fontWeight: 600,
      textShadow: "1px 1px 0px rgba(0, 0, 0, 0.6)"
    }}
  >
    ENTER
  </span>
);

const PressEnterSpan = () => (
  <div
    style={{
      fontSize: "0.7em",
      opacity: "0.7",
      margin: "0.4em 0",
      fontWeight: 400
    }}
  >
    Press <EnterSpan /> to select
  </div>
);

class LeftNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.resetSearch = this.resetSearch.bind(this);

    this.state = {
      filteredStudents: props.students,
      currentSelection: null
    };
  }

  handleSearch = e => {
    const needle = e.target.value.toLowerCase();
    const filteredStudents = filter(this.props.students, s => {
      const firstNameHit = s.first_name.toLowerCase().indexOf(needle) > -1;
      const lastNameHit = s.last_name.toLowerCase().indexOf(needle) > -1;
      const displayNameHit =
        this.displayStudentName(s)
          .toLowerCase()
          .indexOf(needle) > -1;
      return firstNameHit || lastNameHit || displayNameHit;
    });
    const currentSelection =
      needle && filteredStudents.length > 0 ? filteredStudents[0].id : null;

    this.setState({ filteredStudents, currentSelection });
  };

  handleKeyPress = e => {
    if (
      e.key === "Enter" &&
      this.state.filteredStudents.length !== 0 &&
      this.state.currentSelection !== null
    ) {
      this.inputRef.current.value = "";
      this.props.history.push(`/student/${this.state.currentSelection}`);
      this.setState({
        filteredStudents: this.props.students,
        currentSelection: null
      });
    }
  };

  handleKeyDown = e => {
    const UP = 38;
    const DOWN = 40;
    const { filteredStudents, currentSelection } = this.state;
    const currentIndex = findIndex(filteredStudents, { id: currentSelection });

    function cycleNextItem(arr, i, isForward) {
      if (arr.length === 0) return undefined;
      if (isForward && i < arr.length - 1) return arr[i + 1];
      if (isForward) return arr[0];
      if (i === 0) return arr[arr.length - 1];
      return arr[i - 1];
    }

    if (
      this.state.filteredStudents.length > 0 &&
      [UP, DOWN].indexOf(e.keyCode) > -1
    ) {
      const nextStudent = cycleNextItem(
        filteredStudents,
        currentIndex,
        e.keyCode === DOWN
      );
      this.updateCurrentSelection(nextStudent.id);
    }
  };

  resetSearch() {
    this.inputRef.current.value = "";
    this.setState({
      filteredStudents: this.props.students,
      currentSelection: null
    });
  }

  displayStudentName = s => `${s.first_name} ${s.last_name[0]}`;

  updateCurrentSelection(studentId) {
    this.setState({ currentSelection: studentId });
  }

  render() {
    const { students } = this.props;
    if (!students || !students.length) {
      return <Loading />;
    }

    const { filteredStudents } = this.state;
    return (
      <Nav>
        <section>
          <RouteElement to="/" activeStyle={ActiveElementStyle} exact>
            Next Steps
          </RouteElement>
          <RouteElement exact activeStyle={ActiveElementStyle} to="/reminders">
            Reminders
          </RouteElement>
          <Divider />
        </section>
        <StudentSection>
          <Heading>Student Profiles</Heading>
          <SearchContainer>
            <SearchStyled
              type="text"
              placeholder="🔎 Search students..."
              onChange={this.handleSearch}
              onKeyPress={this.handleKeyPress}
              onKeyDown={this.handleKeyDown}
              innerRef={this.inputRef}
            />
          </SearchContainer>
          <StudentList>
            {map(filteredStudents, (s, i, students) => {
              const highlight = s.id === this.state.currentSelection ? 1 : 0;
              return (
                <StudentRow
                  key={s.id}
                  activeStyle={ActiveElementStyle}
                  // Can't use boolean, see:
                  // https://github.com/styled-components/styled-components/issues/1198
                  highlight={highlight}
                  onClick={this.resetSearch}
                  to={`/student/${s.id}`}
                >
                  {this.displayStudentName(s)}
                  {highlight ? <PressEnterSpan /> : null}
                </StudentRow>
              );
            })}
          </StudentList>
        </StudentSection>
      </Nav>
    );
  }
}

export default withRouter(props => (
  <DataConsumer>
    {({ students }) => <LeftNavigation students={students} {...props} />}
  </DataConsumer>
));
