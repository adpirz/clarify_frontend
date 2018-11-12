import React from "react";
import styled from "styled-components";

import { Logo, Button } from "../PatternLibrary";

import { layout, colors } from "./constants";

import { getUserDisplay } from "../../utils";
import { lighten } from "polished";

const Styled = styled.section`
  padding: 10px 20px;
  border-bottom: 1px solid lightgrey;
  height: ${layout.siteNavHeight};
  box-shadow: 0px 3px 23px -3px rgba(0, 0, 0, 0.27);
`;

const Container = styled.div`
  display: flex;
  height: 100%;
  margin: 0 auto;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UserSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UserGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const UserIconStyled = styled.i`
  margin: 0 0.8em;
  font-size: 2em;
  color: ${colors.secondaryMidnightBlue};
`;

const UserDisplayStyled = styled.div`
  margin-right: 2.5em;
  font-size: 1.3em;
  font-weight: 400;
  color: ${lighten(0.2, colors.black)};
`;

const SiteNav = ({ user, logUserOut }) => {
  return (
    <Styled>
      <Container>
        <Logo alt="Clarify Logo" />
        <UserSection>
          {user && (
            <UserGroupStyled>
              <UserIconStyled className="fas fa-user" />
              <UserDisplayStyled>{getUserDisplay(user)}</UserDisplayStyled>
            </UserGroupStyled>
          )}
          {user && <Button onClick={logUserOut}>Logout</Button>}
        </UserSection>
      </Container>
    </Styled>
  );
};

export default SiteNav;
