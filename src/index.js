import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import Router from './components/Router'
import store from './rematch/store'
import { Client } from './modules/apollo'
import { CookiesProvider } from 'react-cookie'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'

ReactDOM.render(
  <CookiesProvider>
    <Provider store={store}>
      <ApolloProvider client={Client}>
        <Router />
      </ApolloProvider>
    </Provider>
  </CookiesProvider>
  , document.getElementById('root'))
registerServiceWorker()
