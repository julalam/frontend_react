import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import ActionCableProvider from 'react-actioncable-provider';

ReactDOM.render((
  <BrowserRouter>
    <ActionCableProvider url='ws://speakeasy-rails.herokuapp.com/cable'>
      <App />
    </ActionCableProvider>
  </BrowserRouter>
),
  document.getElementById('root')
);
registerServiceWorker();
