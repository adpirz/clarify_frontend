import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/Routes';

class App extends React.Component {
  render() {
    console.log(this.props.testFetch.value);
    return (
      <div>
        <BrowserRouter>
          <div>
           {Routes}
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
