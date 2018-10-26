import styled from 'styled-components';
import { darken } from 'polished';
import { colors } from './constants';

const Button = styled.button`
  background: ${props => props.primary ? colors.primaryGreen : colors.white};
  color: ${props => props.primary ? colors.white : colors.black};
  font-size: 1.5em;
  border: 2px solid ${colors.black};
  border-radius: 8px;
  cursor: pointer;
  min-width: 150px;
  display: inline-block;

  &:hover {
    background: ${(props) => darken(.1, props.primary ? colors.primaryGreen : colors.white) };
  }
`;

export default Button;