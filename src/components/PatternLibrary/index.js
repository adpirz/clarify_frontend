import styled from "styled-components";
import { lighten } from "polished";

import ActionCard from "./ActionCard";
import Button from "./Button.js";
import DeltaCard from "./DeltaCard";
import StudentSummaryContainer from "./StudentSummaryContainer";
import GoogleLogo from "./GoogleLogo.js";
import Loading from "./Loading.js";
import SiteNav from "./SiteNav";
import ThirdPartyLoginButton from "./ThirdPartyLoginButton";
import NotFound from "./NotFound";

import { colors, effects } from "./constants";

const AuthFormContainer = styled.div`
  width: 450px;
  margin: 5vh auto;
  min-height: 200px;
  border-radius: 20px;
  background: linear-gradient(
    180deg,
    ${lighten(0.6, colors.backgroundGrey)} 70%,
    ${lighten(0.47, colors.backgroundGrey)}
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  box-shadow: ${effects.formBoxShadow};
  padding: 50px 0 20px;
`;

export {
  ActionCard,
  AuthFormContainer,
  Button,
  StudentSummaryContainer,
  DeltaCard,
  GoogleLogo,
  Loading,
  SiteNav,
  ThirdPartyLoginButton,
  NotFound,
};
