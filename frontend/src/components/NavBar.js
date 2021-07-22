import { createBrowserHistory } from 'history';
import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { AUTH_TOKEN } from '../constants';
import './../styles/NavBar.css';
import logo from './logo.png';
import SearchBar from './SearchBar';
import SignIn from './SignIn';

const NavBar = () => {
  const history = createBrowserHistory({ forceRefresh: true });
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <ul className="nav">
      <Link className="home-img" to="/">
        <img src={logo} alt="Logo" />
      </Link>
      <Link className="home" to="/">
        Easter Egg
      </Link>
      <NavLink className="games-nav" to="/games">
        Games
      </NavLink>
      <NavLink className="contact-nav" to="/contact">
        Contact
      </NavLink>
      <NavLink className="about-nav" to="/about">
        About
      </NavLink>
      <SearchBar />
      {authToken ? (
        <Link
          className="signout"
          onClick={() => {
            localStorage.removeItem(AUTH_TOKEN);
            history.push('/');
          }}
        >
          Sign Out
        </Link>
      ) : (
        <SignIn />
      )}
    </ul>
  );
};

export default withRouter(NavBar);
