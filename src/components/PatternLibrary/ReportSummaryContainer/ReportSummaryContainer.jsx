import styled from 'styled-components';
import {
  effects,
} from '../constants';

const ReportSummaryContainer = styled.div`
  display: inline-block;
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  min-height: 125px;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  cursor: pointer;
  box-shadow: ${effects.boxShadow};

  &:hover {
    box-shadow: ${effects.boxShadowHover};
  }
`;

export default ReportSummaryContainer;