import { MockedProvider } from '@apollo/client/testing';
import { act, render } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import NewsList, { NEWS_QUERY } from './NewsList';

let container = null;
const consoleOutput = [];
const mockedLog = (output) => consoleOutput.push(output);
const originalLog = console.log;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  console.log = mockedLog;
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  console.log = originalLog;
});

const mocks = [
  {
    request: {
      query: NEWS_QUERY,
      variables: {
        first: 3,
        skip: 0,
      },
    },
    result: {
      data: {
        news: [
          {
            id: '1',
            title: 'New Easter Egg',
            body: 'Wow, amazing',
            user: { name: 'me' },
          },
        ],
        count: {
          news: 1,
        },
      },
    },
  },

  {
    request: {
      query: NEWS_QUERY,
      variables: {
        first: 3,
        skip: 0,
      },
    },
    networkError: {
      result: {
        error: {
          unauthorized: true,
        },
      },
    },
  },

  {
    request: {
      query: NEWS_QUERY,
    },
    result: {
      errors: [new GraphQLError('Error :(')],
    },
  },
];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/news/1',
  }),
}));

it('returns the loading state', async () => {
  render(
    <MemoryRouter>
      <MockedProvider mocks={[mocks[0]]} addTypename={false}>
        <NewsList />
      </MockedProvider>
    </MemoryRouter>,
    container,
  );

  expect(document.querySelector('p').textContent).toBe('Loading...');
});

it('returns a list of news', async () => {
  render(
    <MemoryRouter>
      <MockedProvider mocks={[mocks[0]]} addTypename={false}>
        <NewsList />
      </MockedProvider>
    </MemoryRouter>,
    container,
  );

  await act(() => new Promise((resolve) => { setTimeout(resolve, 0); }));

  expect(document.querySelector('.content-container').textContent).toBe(
    'NewsNew Easter EggWow, amazingPosted by: me<>',
  );
});

it('returns an error', async () => {
  render(
    <MemoryRouter>
      <MockedProvider mocks={[mocks[1]]} addTypename={false}>
        <NewsList />
      </MockedProvider>
    </MemoryRouter>,
    container,
  );

  await act(() => new Promise((resolve) => { setTimeout(resolve, 0); }));

  expect(document.querySelector('p').textContent).toBe('Error :(');
  expect(consoleOutput[1]).toBe(
    '[Network error]: {}',
  );
});

it('returns a GraphQL error', async () => {
  render(
    <MemoryRouter>
      <MockedProvider mocks={[mocks[2]]} addTypename={false}>
        <NewsList />
      </MockedProvider>
    </MemoryRouter>,
    container,
  );

  await act(() => new Promise((resolve) => { setTimeout(resolve, 0); }));

  expect(consoleOutput[2]).toBe(
    '[GraphQL error]: []',
  );
});
