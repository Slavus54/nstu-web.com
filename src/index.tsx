import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import {createHttpLink} from 'apollo-link-http'

import App from './App'
import reportWebVitals from './reportWebVitals'
import AppProvider from './context/AppContext'
import {WEBSERVER_URL, APP_NODE} from './env/env'

//@ts-ignore
const link = new createHttpLink({
  uri: WEBSERVER_URL
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(
  document.getElementById(APP_NODE) as HTMLElement
)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <AppProvider>
          <App />
        </AppProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
)

reportWebVitals()