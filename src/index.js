import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1. Import BrowserRouter
import { BrowserRouter } from 'react-router-dom';

// Force canonical domain in production to avoid OAuth origin mismatch

console.log({HostName:window.location.hostname,Env:process.env.REACT_APP_NODE_ENV});

if (
  process.env.REACT_APP_NODE_ENV === 'production' &&
  typeof window !== 'undefined' &&
  window.location.hostname === 'keepmyasset.com'
) {
  const { pathname, search, hash } = window.location;
  window.location.replace(`https://www.keepmyasset.com${pathname}${search}${hash}`);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Wrap your app with BrowserRouter at the top level */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

