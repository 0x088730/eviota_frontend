import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Stack, Card, Button, Form, Modal, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { CARD_DECKS_UPDATE, CARD_DECKS_DELETE } from '../graphql'
import { Spinner } from '../components'

export const CardDeck = ({ id, name, cardCount, refetch }) => {
  const navigate = useNavigate()

  const [isEditMode, setIsEditMode] = useState(false)
  const [deckName, setDeckName] = useState(name)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [loading, setLoading] = useState(false);

  const [updateCardDeck, { loading: updatingCardDeck }] =
    useMutation(CARD_DECKS_UPDATE)

  const [deleteCardDelete, { loading: deletingCardDeck }] =
    useMutation(CARD_DECKS_DELETE)

  const handleCardDeckUpdate = () => {
    updateCardDeck({
      variables: {
        deckId: id,
        deckName,
      },
    })
    setIsEditMode(false)
  }
  
  const handleCardDeckDelete = () => {
    setLoading(true);
    deleteCardDelete({
      variables: {
        deckId: id,
      },
    }).then(() => {
      refetch().then(() => {
        setLoading(false)
      })
    })
    setIsDeleteModalVisible(false)
  }

  return (
    <>
      <Modal
        show={isDeleteModalVisible}
        centered
        onHide={() => {
          setIsDeleteModalVisible(false)
        }}
      >
        <Modal.Header>
          <Modal.Title>Delete Deck: {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">Are you sure you wish to delete this deck?</div>
          <div className="mb-3">
            {cardCount ? (
              <Alert variant="danger" className="mb-3">
                {cardCount} cards will be deleted!
              </Alert>
            ) : (
              '(This deck is empty)'
            )}
          </div>
          <Modal.Footer>
            <Button
              onClick={() => {
                setIsDeleteModalVisible(false)
              }}
              variant="secondary"
            >
              <FontAwesomeIcon icon="circle-xmark" /> Close
            </Button>
            <Button onClick={handleCardDeckDelete} variant="danger">
              <FontAwesomeIcon icon="trash" /> Delete Deck
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
      <Card className="card-deck">
        <Card.Body>
          {updatingCardDeck || deletingCardDeck || loading ? (
            <div style={{ textAlign: 'center' }}>
              <Spinner />
            </div>
          ) : !isEditMode ? (
            <>
              <Card.Title
                style={{ textAlign: 'center', fontSize: '2em' }}
                className="mb-5"
              >
                {name}
              </Card.Title>
              <Stack gap={2} className="col-md-12 mx-auto">
                <Button onClick={() => navigate(`${id}`)}>
                  <FontAwesomeIcon icon="diamond" /> Cards ({cardCount})
                </Button>
                <Button variant="light" onClick={() => setIsEditMode(true)}>
                  <FontAwesomeIcon icon="pencil" /> Edit Deck Name
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setIsDeleteModalVisible(true)}
                >
                  <FontAwesomeIcon icon="trash" /> Delete Deck
                </Button>
              </Stack>
            </>
          ) : (
            <>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Deck name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => setIsEditMode(false)}
                >
                  <FontAwesomeIcon icon="circle-xmark" /> Cancel
                </Button>
                <Button onClick={handleCardDeckUpdate}>
                  <FontAwesomeIcon icon="plus-circle" /> Save Deck
                </Button>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default CardDeck
