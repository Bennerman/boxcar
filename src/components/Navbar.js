import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavLink } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import "../assets/fonts/Butler_Webfont/stylesheet.css"
import "../Navbar.css";

const NavBar = () => {

  
  const firebaseConfig = require('../firebaseConfig');

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const [user] = useAuthState(auth);

  return (
    <Navbar bg="white" expand="lg">
      <Container className="nav">
        <div className="nav-left">
          <Nav.Link href="/contact">contact</Nav.Link>
        </div>
        <Navbar.Brand className="brand" href="/">
          boxcar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto nav-right">
            <Nav.Link href="/shop">shop</Nav.Link>
            <Nav.Link href="/about">about</Nav.Link>
            {user ? (
              <>
                <Nav.Link href="/account">account</Nav.Link>
                <Nav.Link href="/bag">
                  <FontAwesomeIcon icon={faShoppingBag} />
                </Nav.Link>
              </>
            ) : (
              <Nav.Link href="/login">login</Nav.Link>
            )}
            <Nav.Link href='/cart'>cart</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
