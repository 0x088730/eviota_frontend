/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMixpanel } from 'react-mixpanel-browser'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
declare global {
  namespace JSX {
    interface IntrinsicElements {
      pushmenu: any
    }
  }
}

export default function UnauthenticatedHeader() {
  const mixpanel = useMixpanel()
  const { loginWithRedirect } = useAuth0()

  const [pushMenuState, setPushMenuOpen] = useState(false)

  useEffect(() => mixpanel.track('Loaded Landing page'), [mixpanel])

  return (
    <div>
      <pushmenu>
        <span
          style={{ fontSize: '30px', cursor: 'pointer' }}
          onClick={() => setPushMenuOpen(true)}
        >
          <FontAwesomeIcon icon="bars" />
        </span>
        <div
          id="mySidenav"
          className="sidenav"
          style={{ cursor: 'pointer', width: pushMenuState ? '250px' : 0 }}
        >
          <a className="closebtn" onClick={() => setPushMenuOpen(false)}>
            &times;
          </a>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            {/* <li>
              <Link to="about">About</Link>
            </li> */}
            <li>
              <Link to="contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>
      </pushmenu>

      <header className="header">
        <div className="container-fluid">
          <div className="row main">
            <div className="col-md-3">
              <div className="logo">
                <Link to="/">
                  <img src="images/logo.png" alt="" />
                </Link>
              </div>
            </div>
            <div className="col-md-6">
              <div className="page-links">
                <ul>
                  <li>
                    <a href="#">Home</a>
                  </li>
                  {/* <li>
                    <Link to="about">About</Link>
                  </li> */}
                  <li>
                    <Link to="contact-us">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-3">
              <div className="login">
                <ul>
                  <li>
                    <a onClick={() => loginWithRedirect()}>Login</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
