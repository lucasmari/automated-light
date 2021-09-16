import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';

let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('navigates home when you click the logo', () => {
  let testLocation;

  render(
    <BrowserRouter>
      <MockedProvider>
        <div>
          <App />
          <Route
            path="*"
            render={() => {
              testLocation = window.location;
              return null;
            }}
          />
        </div>
      </MockedProvider>
    </BrowserRouter>,
    container
  );

  act(() => {
    const goHomeLink = document.querySelector('.home-img');
    goHomeLink.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(testLocation.pathname).toBe('/news/1');
  expect(document.querySelector('.content-container').textContent).toBe(
    'NewsNo news...'
  );
});

it("navigates home when you click the site's name", () => {
  let testLocation;

  render(
    <BrowserRouter>
      <MockedProvider>
        <div>
          <App />
          <Route
            path="*"
            render={() => {
              testLocation = window.location;
              return null;
            }}
          />
        </div>
      </MockedProvider>
    </BrowserRouter>,
    container
  );

  act(() => {
    const goHomeLink = document.querySelector('.home');
    goHomeLink.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(testLocation.pathname).toBe('/news/1');
  expect(document.querySelector('.content-container').textContent).toBe(
    'NewsNo news...'
  );
});

it('navigates to /games when you click Games', () => {
  render(
    <BrowserRouter initialEntries={['/']}>
      <MockedProvider>
        <App />
      </MockedProvider>
    </BrowserRouter>,
    container
  );

  act(() => {
    const goToGamesLink = document.querySelector('.games-nav');
    goToGamesLink.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(document.querySelector('.content-container').textContent).toBe(
    'Games'
  );
});

it('navigates to /contact when you click Contact', () => {
  render(
    <BrowserRouter initialEntries={['/']}>
      <MockedProvider>
        <App />
      </MockedProvider>
    </BrowserRouter>,
    container
  );

  act(() => {
    const goToContactLink = document.querySelector('.contact-nav');
    goToContactLink.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(document.querySelector('.content-container').textContent).toBe(
    'ContactEmail: easter.egg@email.comTel: 0118 999 881 999 119 7253'
  );
});

it('navigates to /about when you click About', () => {
  render(
    <BrowserRouter initialEntries={['/']}>
      <MockedProvider>
        <App />
      </MockedProvider>
    </BrowserRouter>,
    container
  );

  act(() => {
    const goToAboutLink = document.querySelector('.about-nav');
    goToAboutLink.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(document.querySelector('.content-container').textContent).toBe(
    'AboutThis is an easter egg site...'
  );
});
