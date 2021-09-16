import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
import App from './components/App';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_BACK_ADDRESS,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const cookies = new Cookies();
  const token = cookies.get('csrf');

  return {
    headers: {
      ...headers,
      'X-CSRF-TOKEN': token,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
