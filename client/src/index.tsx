import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { StoreProvider } from './stores/store';
import { Router } from './ui/components/Router/Router';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <Router/>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
) ;
