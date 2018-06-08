import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider } from 'material-ui';
import { DataProvider } from './DataProvider';

ReactDOM.render(
	<MuiThemeProvider>
		<DataProvider >
			<App />
		</DataProvider>
	</MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
