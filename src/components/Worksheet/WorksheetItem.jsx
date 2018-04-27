import React from 'react';
import { Paper } from 'material-ui';
import './Worksheet.css';

const style = {
  height: 175,
  width: 175,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

class WorksheetItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatValue = (val) => val.split('_').join(' ');

  render() {
    const { selectReport, queryResponseValues } = this.props;
    const previewValues = Object.keys(queryResponseValues[0].data);
    return (
      <div
        onClick={() => selectReport()}
        className="inline-block worksheetItem"
      >
        <Paper style={style} zDepth={2} rounded={false}>
          <div>
            <div className="worksheetTitle">title
            </div>
            <hr />
            <div>
              {previewValues &&
                <div className="preview">
                  <div className="highlight previewItem">
                    First Name
                  </div>
                  <div className="previewItem">
                    Last Name
                  </div>
                  {previewValues.map((val, i) => {
                    val = this.formatValue(val);
                    return (
                      <div
                        className={`${i % 2 === 0 ? 'highlight' : ''} previewItem`}
                        key={`${val}-${i}`}
                      >
                        {val}
                      </div>
                    )
                  })}
                </div>
              }
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default WorksheetItem;
