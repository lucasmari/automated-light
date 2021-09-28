import { MockedProvider } from '@apollo/client/testing';
import { act, render } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import GamesList, { GAMES_QUERY } from './GamesList';

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
      query: GAMES_QUERY,
    },
    result: {
      data: {
        games: [
          {
            id: '1',
            name: 'Portal 2',
          },
          {
            id: '2',
            name: 'Stanley Parable',
          },
        ],
      },
    },
  },

  {
    request: {
      query: GAMES_QUERY,
    },
    error: new Error('Error :('),
  },

  {
    request: {
      query: GAMES_QUERY,
    },
    result: {
      errors: [new GraphQLError('Error :(')],
    },
  },
];

it('returns the loading state', () => {
  render(
    <MockedProvider mocks={[mocks[0]]} addTypename={false}>
      <GamesList />
    </MockedProvider>,
    container,
  );

  expect(document.querySelector('p').textContent).toBe('Loading...');
});

it('returns a list of games', async () => {
  render(
    <MockedProvider mocks={[mocks[0]]} addTypename={false}>
      <GamesList />
    </MockedProvider>,
    container,
  );

  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(document.querySelector('.content-container').textContent).toBe(
    'GamesPortal 2Stanley Parable',
  );
});

it('returns an error', async () => {
  render(
    <MockedProvider mocks={[mocks[1]]} addTypename={false}>
      <GamesList />
    </MockedProvider>,
    container,
  );

  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(document.querySelector('p').textContent).toBe('Error :(');
});

it('returns a GraphQL error', async () => {
  render(
    <MockedProvider mocks={[mocks[2]]} addTypename={false}>
      <GamesList />
    </MockedProvider>,
    container,
  );

  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(consoleOutput[2]).toBe(
    '[GraphQL error]: [\n  {\n    "message": "Error :("\n  }\n]',
  );
});
