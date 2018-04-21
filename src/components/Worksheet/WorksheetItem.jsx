import React from 'react';
import { Paper } from 'material-ui';
import './Worksheet.css';

const style = {
  height: 150,
  width: 150,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

class WorksheetItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { value } = this.props;
    console.log('value: ', value);
    return (
      <div className="inline-block">
        <Paper style={style} zDepth={2} rounded={false}>
          <div>
            <div className="worksheetTitle">title
            </div>
            <hr />
          </div>
        </Paper>
      </div>
    );
  }
}

export default WorksheetItem;
