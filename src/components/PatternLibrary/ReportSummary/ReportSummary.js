import styled from 'styled-components';
import { darken } from 'polished';
import colors from '../colors.js';

const ReportSummary = styled.div`
  display: inline-block;
  border-radius: 10px;
  box-shadow: 0px -1px 10px 2px rgba(166,166,166,1);
  padding: 10px;
  min-height: 125px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background: ${() => darken(.1, colors.white) };
  }
`;

export default ReportSummary;