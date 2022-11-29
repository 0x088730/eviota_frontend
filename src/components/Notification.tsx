import React, { useState, useEffect } from 'react'
import { Toast } from 'react-bootstrap'
import { useMutation,  } from '@apollo/client'
import { NOTIFICATIONS_UPDATE } from '../graphql'
import { format } from 'timeago.js'

const NotificationsList = ({ notification }) => {
  const [updateNotification, /* { loading: updatingCard } */] = useMutation(NOTIFICATIONS_UPDATE)
  const [updatedAt, setUpdatedAt] = useState('')

  const handleOnNotificationClose = (notificationId: number) => {
    updateNotification({
      variables: {
        notificationId,
        status: 'dismissed'
      }
    })
  }

  useEffect(() => {
    const updateInterval = async () => setUpdatedAt(format(notification.created_at))
    updateInterval()
    const intervalId = setInterval(updateInterval, 1000)
    return () => clearInterval(intervalId)
  })

  return (
    <Toast
      onClose={() => handleOnNotificationClose(notification.id)}
      className="fade"
    >
      <Toast.Header>
        <strong className="me-auto">{notification.title}</strong>
        <small className="text-muted">{updatedAt}</small>
      </Toast.Header>
      <Toast.Body>{notification.description}</Toast.Body>
    </Toast>
  )
}

export default NotificationsList
