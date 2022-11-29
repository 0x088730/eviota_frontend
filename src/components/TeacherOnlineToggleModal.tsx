import React, { useEffect, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { useMixpanel } from 'react-mixpanel-browser'
import { useCurrentUser } from '../hooks'
import { Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DateTime } from 'luxon'
import { USER_PRIVATE_SAVE } from '../graphql'

const TeacherOnlineToggleModal = ({
  checkinTimestamp,
  show,
  onClose,
}: {
  checkinTimestamp?: any,
  show: boolean,
  onClose: () => any
}) => {
  const mixpanel = useMixpanel()

  useEffect(() => mixpanel.track('Loaded dashboard'), [mixpanel])
  const [
    saveUser,
    {
      loading: savingUserData
    },
  ] = useMutation(USER_PRIVATE_SAVE)

  const { currentUser } = useCurrentUser()

  const toggleOnline = useCallback(() => {

    if (savingUserData) return

    const checkin_timestamp = currentUser.checkin_timestamp ? null : DateTime.now().toISO()
    
     saveUser({
        variables: {
          userId: currentUser.user_id,
          payload: {
            checkin_timestamp
          }
        },
      })

  }, [currentUser, saveUser, savingUserData])

  return (
    <Modal centered show={show}>
      <Modal.Header>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <p>By continuing, you acknowledge that:</p>
          {!checkinTimestamp ? (
            <ul>
              <li>
                <p>
                  Students will be able to request immediate lessons with you.
                </p>
                <p>
                  You may choose to <b>accept</b> or <b>reject</b> a booking.
                </p>
              </li>
              <li>
                <p>
                  Lesson durations are <b>30 minutes</b>.
                </p>
                <p>
                  Please ensure that you are able to teach a 30 minute lesson.
                </p>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <p>
                  Students will no longer be able to book lessons with you
                  (until you set yourself as <strong>online</strong> again).
                </p>
              </li>
            </ul>
          )}
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onClose()}>
            <FontAwesomeIcon icon="circle-xmark" onClick={() => onClose()} />{' '}
            Close
          </Button>
          <Button
            variant="light"
            onClick={() => {
              toggleOnline()
              onClose()
            }}
          >
            {!checkinTimestamp ? (
              <>
                <FontAwesomeIcon
                  style={{ color: '#198754' }}
                  icon="circle"
                  onClick={() => onClose()}
                />{' '}
                Go online
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  style={{ color: '#b02a37' }}
                  icon="circle"
                  onClick={() => onClose()}
                />{' '}
                Go offline
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default TeacherOnlineToggleModal
