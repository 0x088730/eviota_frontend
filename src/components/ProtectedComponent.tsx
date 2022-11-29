import React from 'react'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import { PageLoader, NotificationsList } from '../components'
import { Container } from 'react-bootstrap'

const ProtectedComponent = ({ component, ...propsForComponent }) => {
  const Cp = withAuthenticationRequired(component, {
    onRedirecting: () => <PageLoader />,
  })

  return (
    <Container style={{ marginTop: '20px', minHeight: '400px' }}>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="position-relative"
        style={{ marginTop: '20px' }}
      >
        <NotificationsList />
      </div>
      <br />
      <Cp {...propsForComponent} />
    </Container>
  )
}

export default ProtectedComponent
