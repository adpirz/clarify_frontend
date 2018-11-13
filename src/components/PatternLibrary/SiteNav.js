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

const SiteNav = ({ user, logUserOut }) => {
  return (
    <Styled>
      <Container>
        <Logo alt="Clarify Logo" />
        <UserSection>
          {user && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <i
                className="fas fa-user"
                style={{
                  fontSize: "2em",
                  margin: "0 0.8em",
                  color: colors.secondaryMidnightBlue,
                }}
              />
              <div
                style={{
                  marginRight: "2.5em",
                  fontSize: "1.3em",
                  fontWeight: "400",
                  color: lighten(0.2, colors.black),
                }}
              >
                {getUserDisplay(user)}
              </div>
            </div>
          )}
          {user && <Button onClick={logUserOut}>Logout</Button>}
        </UserSection>
      </Container>
    </Styled>
  );
};

export default SiteNav;
