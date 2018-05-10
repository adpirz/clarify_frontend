import styled from 'styled-components';
import { darken } from 'polished';
import colors from '../colors.js';

const Button = styled.button`
  background: ${props => props.primary ? colors.primaryGreen : colors.white};
  color: ${props => props.primary ? colors.white : colors.black};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid ${colors.black};
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: ${(props) => darken(.1, props.primary ? colors.primaryGreen : colors.white) };
  }
`;

export default Button;