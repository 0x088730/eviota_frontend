import React from 'react'
import { useCurrentUser } from '../hooks'
import { Card, Form } from 'react-bootstrap'

const ActionsChecklist = (props) => {
  const actionsAvailable = [
    { key: 'profile-name-completed', name: 'Complete name in profile' },
    { key: 'kin-wallet-created', name: 'Create a Kin wallet' },
    { key: 'create-card-deck', name: 'Create a card deck' },
    { key: 'complete-deck-revision', name: 'Complete a card deck revision' },
    { key: 'book-lesson', name: 'Book a lesson' },
  ]

  const { currentUser } = useCurrentUser()
  return (
    <Card {...props}>
      <Card.Body>
        <Card.Title>Complete these actions to earn Kin rewards.</Card.Title>
        <div className="mt-3">
          {currentUser &&
            currentUser.actions &&
            actionsAvailable.map((actionAvailable) => (
              <Form.Check
                key={actionAvailable.key}
                className="mb-2"
                type="checkbox"
                label={actionAvailable.name}
                checked={currentUser.actions.some(
                  (action) => action.key === actionAvailable.key
                )}
                readOnly={true}
              />
            ))}
        </div>
      </Card.Body>
    </Card>
  )
}

export default ActionsChecklist
