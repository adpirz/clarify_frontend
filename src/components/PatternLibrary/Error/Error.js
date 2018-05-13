import styled from 'styled-components';
import colors from '../colors.js';
import { fonts } from '../constants.js';

const Error = styled.div`
  background-color: ${colors.errorRed};
  color: ${colors.black};
  font-size: ${fonts.fontSizeMedium};
  font-weight: bold;
  padding: 10px 0px;
  margin: 15px auto;
  text-align: center;
  width: 75%;
  visibility: ${(props) => props.show ? 'visible' : 'hidden'}
`;

export default Error;