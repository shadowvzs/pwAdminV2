import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { RootStoreContextProvider } from './contexts/RootStoreContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <RootStoreContextProvider>
        <App />
      </RootStoreContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
