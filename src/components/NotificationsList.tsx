import React from 'react'
import { ToastContainer } from 'react-bootstrap'
import { useCurrentUser } from '../hooks'
import { Notification } from './'

const Notifications = () => {
  const { currentUser } = useCurrentUser()

  return (
    <ToastContainer
      position="top-end"
      className="position-absolute"
      style={{ zIndex: 1 }}
    >
      {currentUser &&
        currentUser.notifications &&
        currentUser.notifications.map((notification) => (
          <Notification notification={notification} key={notification.id} />
        ))}
    </ToastContainer>
  )
}

export default Notifications
