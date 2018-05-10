import styled from 'styled-components';
import colors from '../colors.js';

const Error = styled.div`
  background-color: ${colors.errorRed};
  color: ${colors.black};
  font-weight: bold;
  height: 20px;
  text-align: center;
  visibility: ${(props) => props.show ? 'visible' : 'hidden'}
`;

export default Error;