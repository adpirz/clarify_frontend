import React from "react";
import map from "lodash/map";
import filter from "lodash/filter";
import findIndex from "lodash/findIndex";
import { NavLink, withRouter } from "react-router-dom";
import { Menu, Input, Label, Divider, Header, Icon, Button } from "semantic-ui-react";

import { DataConsumer } from "../DataProvider";
import styled from "styled-components";

const OverflowMenu = styled.div`
  height: 70vh;
  overflow-y: scroll;
`;

const StyledStudent = styled(NavLink)`
  color: ${props => (props.isActive ? "white !important" : "inherit")};
  font-size: 1em !important;
`;

class LeftNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.resetSearch = this.resetSearch.bind(this);

    this.state = {
      filteredStudents: props.students,
      currentSelection: null,
    };
  }

  componentWillReceiveProps = nextProps => {
    const newStudents = nextProps.students;
    const oldStudents = this.props.students;

    if (newStudents && oldStudents.length !== newStudents.length) {
      this.setState = {
        filteredStudents: newStudents,
      };
    }
  };

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
    const currentSelection = needle && filteredStudents.length > 0 ? filteredStudents[0].id : null;

    this.setState({ filteredStudents, currentSelection });
  };

  handleKeyPress = e => {
    if (
      e.key === "Enter" &&
      this.state.filteredStudents.length !== 0 &&
      this.state.currentSelection !== null
    ) {
      this.search.inputRef.value = "";
      this.props.history.push(`/student/${this.state.currentSelection}`);
      this.setState({
        filteredStudents: this.props.students,
        currentSelection: null,
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

    if (this.state.filteredStudents.length > 0 && [UP, DOWN].indexOf(e.keyCode) > -1) {
      const nextStudent = cycleNextItem(filteredStudents, currentIndex, e.keyCode === DOWN);
      this.updateCurrentSelection(nextStudent.id);
    }
  };

  resetSearch() {
    this.search.inputRef.value = "";
    this.setState({
      filteredStudents: this.props.students,
      currentSelection: null,
    });
  }

  displayStudentName = s => `${s.first_name} ${s.last_name[0]}`;

  updateCurrentSelection(studentId) {
    this.setState({ currentSelection: studentId });
  }

  render() {
    const { filteredStudents } = this.state;

    return (
      <Menu fixed="left" size="huge" borderless vertical>
        <Menu.Item>
          <Menu.Header>
            <Header as="h2">Clarify</Header>
          </Menu.Header>
        </Menu.Item>
        <Menu.Item>
          <Button icon labelPosition="left" fluid>
            <Icon name="user circle" size="large" />
            Mr. Mosh
          </Button>
        </Menu.Item>
        {[
          { name: "Next Steps", to: "/" },
          { name: "Reminders", disabled: true, to: "/reminders" },
        ].map(route => (
          <Menu.Item
            key={route.name}
            as={NavLink}
            disabled={route.disabled}
            activeClassName="active"
            exact
            to={route.to}
          >
            <Menu.Header>{route.name}</Menu.Header>
          </Menu.Item>
        ))}
        <Divider horizontal>
          <Header as="h3">Student List</Header>
        </Divider>
        <Menu.Item>
          <Input
            icon="search"
            ref={input => (this.search = input)}
            onChange={this.handleSearch}
            onKeyPress={this.handleKeyPress}
            onKeyDown={this.handleKeyDown}
            placeholder="Search for students..."
          />
        </Menu.Item>
        <Menu.Menu as={OverflowMenu}>
          {map(filteredStudents, (s, i, arr) => {
            const highlight = s.id === this.state.currentSelection;
            return (
              <Menu.Item
                as={StyledStudent}
                onClick={this.resetSearch}
                to={`/student/${s.id}`}
                activeClassName="active"
                active={Boolean(highlight)}
                key={s.id}
              >
                {this.displayStudentName(s)}
                {highlight ? <Label color="teal">Enter to select</Label> : null}
              </Menu.Item>
            );
          })}
        </Menu.Menu>
      </Menu>
    );
  }
}

export default withRouter(props => (
  <DataConsumer>{({ students }) => <LeftNavigation students={students} {...props} />}</DataConsumer>
));
