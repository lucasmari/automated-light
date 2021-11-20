import React from 'react';
import {
  Link, NavLink, withRouter,
} from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
  COOKIE_PATH,
  COOKIE_SAME_SITE, COOKIE_SIGNED_IN_NAME,
} from '../constants';
import '../styles/NavBar.css';
import logo from './logo.png';
import SearchBar from './SearchBar';
import SignIn from './SignIn';

const NavBar = () => {
  const cookies = new Cookies();
  const signedIn = cookies.get(COOKIE_SIGNED_IN_NAME);

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
      {signedIn ? (
        <Link
          className="signout"
          to="/"
          onClick={() => {
            cookies.set(COOKIE_SIGNED_IN_NAME, '', {
              path: COOKIE_PATH,
              sameSite: COOKIE_SAME_SITE,
            });
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
