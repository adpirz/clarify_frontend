import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRefetchContainer from './AppRefetchContainer';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <AppRefetchContainer />,
  document.getElementById('root')
);
registerServiceWorker();
