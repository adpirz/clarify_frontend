import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { GoogleLogo } from "./PatternLibrary";
import { colors, fontSizes } from "./PatternLibrary/constants";

const GAPI_CLIENT_ID =
  process.env.REACT_APP_GAPI_CLIENT_ID ||
  "729776830467-i92lfrj8sdj1ospq4rn349dvsu0jbjgi.apps.googleusercontent.com";

const GoogleButton = styled.button`
  border-radius: 0;
  background-color: ${colors.googleBlue};
  width: 250px;
  height: 50px;
  font-size: ${fontSizes.medium};
  color: ${colors.white};
  display: flex;
  border: 1px solid ${colors.googleBlue}
  margin: 0 auto;
  padding: 0;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.25);

  &:hover {
    box-shadow: 0 0 3px 3px rgba(66,133,244,.3);
  }
`;

const GoogleLogoContainer = styled.div`
  height: 48px;
  background-color: ${colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const ButtonLabel = styled.span`
  flex-grow: 3;
`;

const SCOPES =
  "https://www.googleapis.com/auth/classroom.courses.readonly " +
  "https://www.googleapis.com/auth/classroom.rosters.readonly";

class GoogleAuth extends React.Component {
  propTypes: {
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func,
  };

  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      if (!window.gapi.auth2.getAuthInstance()) {
        window.gapi.auth2.init({ client_id: GAPI_CLIENT_ID });
      }
    });
  }

  authenticate = () => {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({
        scope: SCOPES,
      })
      .then(
        res => {
          // this.handleSigninSuccess(res);
          this.loadClient().then(this.loadCourses);
          console.log("Sign-in successful");
        },
        err => {
          console.error("Error signing in", err);
        }
      );
  };

  loadCourses = () => {
    window.gapi.client.classroom.courses
      .list({
        courseStates: ["ACTIVE"],
        teacherId: "105401676974496975663",
      })
      .then(
        function(response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
        },
        function(err) {
          console.error("Execute error", err);
        }
      );
  };

  loadClient = () => {
    return window.gapi.client
      .load("https://content.googleapis.com/discovery/v1/apis/classroom/v1/rest")
      .then(
        function() {
          console.log("GAPI client loaded for API");
        },
        function(err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  };

  handleSigninSuccess(res) {
    const { id_token: accessToken } = res.getAuthResponse();
    this.props.onSuccess(accessToken);
  }

  render() {
    return (
      <GoogleButton onClick={this.authenticate}>
        <GoogleLogoContainer>
          <GoogleLogo />
        </GoogleLogoContainer>
        <ButtonLabel>Sign in</ButtonLabel>
      </GoogleButton>
    );
  }
}

export default GoogleAuth;
