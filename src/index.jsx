import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import 'leaflet/dist/leaflet.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import { IssuesProvider } from './state/IssuesContext.jsx';
import { AuthProvider } from './state/AuthContext.jsx';
import './i18n'; // Import i18n configuration

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <IssuesProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </IssuesProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();


