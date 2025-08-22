
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_REDIRECT_URI, AUTH0_AUDIENCE } from './authConfig';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: AUTH0_REDIRECT_URI,
        audience: AUTH0_AUDIENCE,
        scope: 'openid profile email offline_access'
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
