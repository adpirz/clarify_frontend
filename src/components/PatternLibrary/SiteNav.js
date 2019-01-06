import React from "react";
import { getUserDisplay } from "../../utils";
import { Menu, Icon, Button } from "semantic-ui-react";
import styled from "styled-components";
import { colors } from "./constants";

const LogoDiv = styled.div`
  font-size: 2em;
  color: ${colors.accent};
`;
const UserLoggedIn = ({ user, logUserOut }) => {
  return (
    <Menu.Item position="right">
      {getUserDisplay(user)}
      <Icon name="user" size="large" />
      <Button onClick={logUserOut}>Logout</Button>
    </Menu.Item>
  );
};

const SiteNav = ({ user, logUserOut }) => {
  return (
    <Menu secondary size="massive">
      <Menu.Item header>
        <LogoDiv>Clarify</LogoDiv>
      </Menu.Item>
      {user ? <UserLoggedIn user={user} logUserOut={logUserOut} /> : null}
    </Menu>
  );
};

export default SiteNav;
