import styled from 'styled-components';

import ActionCard from './ActionCard.js';
import ActionForm from './ActionForm.js';
import Button from './Button.js';
import Error from './Error.js';
import EmptyState from './EmptyState.js';
import {
  ActionIcon,
  ActionIconImage,
  ActionIconList,
} from './ActionItems.js';
import GoogleLogo from './GoogleLogo.js';
import Loading from './Loading.js';
import Logo from './Logo.js';
import PageHeading from './PageHeading.js';



const MainContentBody = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;


export {
  ActionCard,
  ActionForm,
  ActionIcon,
  ActionIconImage,
  ActionIconList,
  Button,
  EmptyState,
  Error,
  GoogleLogo,
  Loading,
  Logo,
  MainContentBody,
  PageHeading,
};