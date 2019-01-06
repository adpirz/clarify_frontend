import styled from "styled-components";
import { lighten } from "polished";

import ActionCard from "./ActionCard.js";
import { ActionIcon, ActionIconImage, ActionIconList } from "./ActionItems.js";
import Button from "./Button.js";
import DeltaCard from "./DeltaCard";
import Error from "./Error.js";
import Message from "./Message.js";
import EmptyState from "./EmptyState.js";
import GoogleLogo from "./GoogleLogo.js";
import Loading from "./Loading.js";
import Logo from "./Logo.js";
import PageHeading from "./PageHeading.js";
import SiteNav from "./SiteNav";
import ThirdPartyLoginButton from "./ThirdPartyLoginButton";
import NotFound from "./NotFound";

import { colors, effects } from "./constants";

const MainContentBody = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 100px;
`;

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
  ActionIcon,
  ActionIconImage,
  ActionIconList,
  AuthFormContainer,
  Button,
  DeltaCard,
  EmptyState,
  Error,
  Message,
  GoogleLogo,
  Loading,
  Logo,
  MainContentBody,
  PageHeading,
  SiteNav,
  ThirdPartyLoginButton,
  NotFound,
};
