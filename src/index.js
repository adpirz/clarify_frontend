import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRefetchContainer from './AppRefetchContainer';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider } from 'material-ui';

ReactDOM.render(
	<MuiThemeProvider>
  	<AppRefetchContainer />
  </MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
