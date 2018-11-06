import React from "react";
import styled from "styled-components";

import { Logo, Button } from "../PatternLibrary";

import { layout } from "./constants";

const Styled = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid lightgrey;
  height: ${layout.siteNavHeight};
`;

const SiteNav = ({ user, logUserOut }) => {
  return (
    <Styled>
      <Logo alt="Clarify Logo" />
      <div
        style={{
          borderLeft: "2px solid lightgrey",
          paddingLeft: "25px"
        }}
      >
        {user && (
          <span style={{ marginRight: "15px" }}>
            <i className="fas fa-user" style={{ margin: "0 10px" }} />
            User: {user.username}
          </span>
        )}
        {user && <Button onClick={logUserOut}>Logout</Button>}
      </div>
    </Styled>
  );
};

export default SiteNav;
