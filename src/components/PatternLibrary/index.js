import styled from "styled-components";

import ActionCard from "./ActionCard.js";
import { ActionIcon, ActionIconImage, ActionIconList } from "./ActionItems.js";
import Button from "./Button.js";
import { DeltaCard, ContextDelta } from "./DeltaContainer";
import Error from "./Error.js";
import Message from "./Message.js";
import EmptyState from "./EmptyState.js";
import GoogleLogo from "./GoogleLogo.js";
import Loading from "./Loading.js";
import Logo from "./Logo.js";
import PageHeading from "./PageHeading.js";
import SiteNav from "./SiteNav";
import NotFound from "./404";

import { colors } from "./constants";

const MainContentBody = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 100px;
`;

const ActionTextArea = styled.textarea`
  resize: vertical;
  width: calc(100% - 20px);
  height: 80px;
  padding: 10px;
  border: ${({ error }) => {
    return error ? `1px solid ${colors.errorOrange};` : "initial;";
  }};
`;

export {
  ActionCard,
  ActionIcon,
  ActionIconImage,
  ActionIconList,
  ActionTextArea,
  Button,
  DeltaCard,
  ContextDelta,
  EmptyState,
  Error,
  Message,
  GoogleLogo,
  Loading,
  Logo,
  MainContentBody,
  PageHeading,
  SiteNav,
  NotFound,
};
