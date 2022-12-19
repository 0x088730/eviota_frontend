import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import './bootstrap-eviota.css'
import { MixpanelProvider } from 'react-mixpanel-browser';
import { ApolloWrapper } from './components/apollo-wrapper'
import { KinProvider } from './lib/kin-client'
import { KinTest, KinProd } from '@kin-sdk/client';

ReactDOM.render(
  <MixpanelProvider>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ''}
      redirectUri={window.location.origin}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE || ''}
      useRefreshTokens={true}
    >
      <KinProvider
        appIndex={Number(process.env.REACT_APP_KIN_APP_INDEX)}
        kinNetwork={process.env.NODE_ENV === 'production' ? KinProd : KinTest}
      >
        <BrowserRouter>
          <ApolloWrapper>
            <App />
          </ApolloWrapper>
        </BrowserRouter>
      </KinProvider>
    </Auth0Provider>
  </MixpanelProvider>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
