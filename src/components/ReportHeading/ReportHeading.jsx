import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { ReportActions, Button } from '../PatternLibrary'
import { fonts } from '../PatternLibrary/constants';

const ReportTitle = styled.h4`
  display: inline-block;
  font-size: ${fonts.large};
  margin: 0;
`;

export default ({
  title,
  crumbs,
  deselectReport,
  handleSaveClick,
  handleDeleteClick,
  handleShareClick,
  handlePopReportLevel,
  getReportById,
  reportId,
}) => {

  let shareByNode = null;
  let shareWithNode = null;
  if (reportId) {
    const { shared_by, shared_with } = getReportById(reportId);

    if (shared_by) {
      shareByNode = <span key="share_by">Shared by: {shared_by.staff}</span>;
    }
    if (shared_with && shared_with.length) {
      const sharedWithNames = _.map(shared_with, 'staff').join(', ');
      shareWithNode = (
        <span
          title={sharedWithNames}
          style={{opacity: '.5'}}
          key="share_with">
          Shared with {shared_with.length} educator{shared_with.length > 1 ? 's' : null}
        </span>
      );
    }

  }

  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
      <Button onClick={deselectReport} style={{display: 'inline-block'}}>
        Back to worksheet
      </Button>
      <div style={{flexGrow:"1", textAlign:"center"}}>
        <ReportTitle>{title}</ReportTitle>
        {shareWithNode ? <span>-- {shareWithNode}</span> : null}
        {_.map(crumbs, (c) => {
          return (
            <span key={c.query}>
              &nbsp;>&nbsp;{c.label}
            </span>
          );
        })}
        {shareByNode ? <div>({shareByNode})</div> : null}
      </div>
      <ReportActions
        handleDeleteClick={handleDeleteClick}
        handleSaveClick={handleSaveClick}
        handleShareClick={handleShareClick}
        handlePopReportLevel={handlePopReportLevel}
      />
    </div>
  )
};