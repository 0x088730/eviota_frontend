import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useCurrentUser } from '../hooks'
import { ImageWithPlaceholder } from '.'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pushmenu: any
    }
  }
}

const Header = () => {
  const { logout } = useAuth0()
  const { currentUser, loading } = useCurrentUser()

  return (
    <Navbar bg="light" expand="md" style={{ marginBottom: '1rem' }}>
      <Container>
        <Navbar.Brand href="#home">
          <img src="images/logo-horizontal.png" width="120" alt="Eviota" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse>
          <LinkContainer to="dashboard" activeClassName="selected">
            <Nav.Link>Dashboard</Nav.Link>
          </LinkContainer>
          <LinkContainer to="teachers" activeClassName="selected">
            <Nav.Link>Find a teacher</Nav.Link>
          </LinkContainer>
          <LinkContainer to="card-decks" activeClassName="selected">
            <Nav.Link>Cards</Nav.Link>
          </LinkContainer>
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end">
          <NavDropdown
            title={
              <ImageWithPlaceholder
                image={
                  !loading && currentUser && currentUser.profile_image
                    ? `${process.env.REACT_APP_GOOGLE_CLOUD_PROFILE_IMAGE_BASE_URL}/${currentUser.profile_image}`
                    : ''
                }
                preview_image="images/placeholder-avatar.png"
                roundedCircle={true}
                style={{ width: '50px', height: '50px' }}
                alt="me"
              />
            }
          >
            <LinkContainer to="profile">
              <NavDropdown.Item>Profile</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="wallet">
              <NavDropdown.Item>Wallet</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Divider />
            <LinkContainer to="support">
              <NavDropdown.Item>Support</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Divider />
            <NavDropdown.Item
              href="#"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
