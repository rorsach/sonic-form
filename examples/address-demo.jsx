import React from 'react';
import ReactDOM from 'react-dom/client';
import AddressForm from './address-validation.tsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AddressForm />
  </React.StrictMode>
);
