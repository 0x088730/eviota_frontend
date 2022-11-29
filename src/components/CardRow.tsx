import React, { useState, useCallback } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@apollo/client'
import { CARD_CREATE, CARD_UPDATE, CARD_DELETE } from '../graphql'

const CardRow = ({
  isNew = false,
  deckId,
  card,
  onChange,
  setChange
}: {
  isNew?: boolean
  deckId: number
  card?: any
  onChange?: () => void;
  setChange?: () => void;
}) => {
  const MAX_CARD_TEXT_LENGTH = 22

  const [isEditMode, setIsEditMode] = useState(isNew);

  const [cardState, setCardState] = useState({
    side1: isNew ? '' : card.side1,
    side2: isNew ? '' : card.side2,
  })

  const formatCardString = useCallback(
    (cardText?: string) =>
      !cardText
        ? ''
        : `${cardText.substring(0, MAX_CARD_TEXT_LENGTH)}${
            cardText.length > MAX_CARD_TEXT_LENGTH ? '...' : ''
          }`,
    []
  )
  

  const [createCard /* { loading: creatingCard } */] = useMutation(CARD_CREATE)
  const [updateCard /* { loading: updatingCard } */] = useMutation(CARD_UPDATE)
  const [deleteCard /* { loading: deletingCard } */] = useMutation(CARD_DELETE)

  const handleCardSave =  () => {
    if (isNew) {
      createCard({
          variables: {
            deckId,
            side1: cardState.side1,
            side2: cardState.side2,
          },
        }).then(() => {
          onChange && onChange();
        })
        setChange && setChange()
        setCardState({ side1: '', side2: '' })
      } else {
      if (!card.id) {
        throw new Error('Card ID undefined.')
      }
      updateCard({
        variables: {
          cardId: card.id,
          side1: cardState.side1,
          side2: cardState.side2,
        },
      })
      setIsEditMode(false)
    };
    
  }

  const handleCardDelete = () => {
    if (!card.id) {
      throw new Error('Card ID undefined.')
    }
    deleteCard({
      variables: {
        cardId: card.id,
      },
    })
    setIsEditMode(false)
  }

  return (
    <>
      <Form>
        <Row>
          <Col sm={5} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            {isEditMode ? (
              <Form.Control
                placeholder="Side 1"
                value={cardState.side1}
                onChange={(e) =>
                  setCardState({ ...cardState, side1: e.target.value })
                }
              />
            ) : (
              <span>{formatCardString(cardState.side1)}</span>
            )}
          </Col>
          <Col sm={5} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            {isEditMode ? (
              <Form.Control
                placeholder="Side 2"
                value={cardState.side2}
                onChange={(e) =>
                  setCardState({ ...cardState, side2: e.target.value })
                }
              />
            ) : (
              <span>{formatCardString(cardState.side2)}</span>
            )}
          </Col>
          <Col sm={2}>
            {!isEditMode ? (
              <Button variant="light" onClick={() => setIsEditMode(true)}>
                <FontAwesomeIcon icon="pencil" />
              </Button>
            ) : (
              <>
                <Button variant="light" onClick={handleCardSave}>
                  <FontAwesomeIcon icon={isNew ? 'plus-circle' : 'save'} />
                </Button>
                {!isNew && (
                  <Button variant="danger" onClick={handleCardDelete}>
                    <FontAwesomeIcon icon="trash" />
                  </Button>
                )}
              </>
            )}
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default CardRow
