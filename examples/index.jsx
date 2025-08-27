import React from 'react';
import ReactDOM from 'react-dom/client';
import DemoApp from './demo-app.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DemoApp />
  </React.StrictMode>
);
