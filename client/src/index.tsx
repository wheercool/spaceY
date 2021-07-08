import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { StoreProvider } from './stores/store';
import { Router } from './ui/components/Router/Router';
import { Dialog } from './ui/components/Dialog/Dialog';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <Router/>
      <Dialog/>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
) ;
