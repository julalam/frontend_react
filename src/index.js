import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import ActionCableProvider from 'react-actioncable-provider';

ReactDOM.render((
  <BrowserRouter>
    <ActionCableProvider url='ws://localhost:8080/cable'>
      <App />
    </ActionCableProvider>
  </BrowserRouter>
),
  document.getElementById('root')
);
registerServiceWorker();
