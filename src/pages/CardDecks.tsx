import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useMixpanel } from 'react-mixpanel-browser'
import { Row, Col, Card, Button, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CARD_DECKS, CARD_DECKS_CREATE } from '../graphql'
import { CardDeck, Alert, PageLoader, Spinner } from '../components'
import { useCurrentUser } from '../hooks'

const CardDecks = () => {
  const mixpanel = useMixpanel()

  const LANGUAGE_ID = 2 // Hardcoded for Spanish 🇪🇸

  const {
    currentUser,
    isCurrentUserAvailable,
    error: currentUserError,
  } = useCurrentUser()

  const [isNewCardMode, setIsNewCardMode] = useState(false)
  const [userLanguageId, setUserLanguageId] = useState<number | undefined>(
    undefined
  )
  const [deckName, setDeckName] = useState('')

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser.user_languages) {
      return
    }

    const languageId = currentUser.user_languages
      .filter((teacherLanguage) => teacherLanguage.language.id === LANGUAGE_ID)
      .pop().id

    setUserLanguageId(languageId)
  }, [currentUser.user_languages])

  useEffect(() => mixpanel.track('Loaded card decks'), [mixpanel])

  const {
    data: cardDeckData,
    loading: cardDecksLoading,
    error: cardDecksError,
    refetch,
  } = useQuery(CARD_DECKS)

  const [createCardDeck] =
    useMutation(CARD_DECKS_CREATE)

  const handleCardDeckSave = () => {
    setLoading(true);
    createCardDeck({
      variables: {
        userLanguageId,
        deckName,
      },
    }).then(() => {
      refetch().then(() => {
        setLoading(false);
      })
    })
    setIsNewCardMode(false)
    setDeckName('')
  }

  return (
    <>
      {cardDecksError || currentUserError ? (
        <Alert error={cardDecksError || currentUserError} />
      ) : cardDecksLoading || !isCurrentUserAvailable() ? (
        <PageLoader />
      ) : (
        <Row xs={1} md={3} className="g-4 mb-5">
          {cardDeckData &&
            cardDeckData.decks &&
            cardDeckData.decks.map((deck) => (
              <Col key={deck.id}>
                <CardDeck id={deck.id} name={deck.name} cardCount={deck.cards_aggregate.aggregate.count} refetch={refetch} />
              </Col>
            ))}
          {loading && (
            <Col>
              <Card className="card-deck">
                <Card.Body style={{ textAlign: 'center' }}>
                  <Spinner />
                </Card.Body>
              </Card>
            </Col>
          )}
          <Col>
            <Card className="card-deck">
              {!isNewCardMode ? (
                <span
                  className="add-card-button"
                  onClick={() => setIsNewCardMode(true)}
                >
                  <FontAwesomeIcon icon="plus-circle" size="8x" />
                </span>
              ) : (
                <Card.Body>
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
                      onClick={() => setIsNewCardMode(false)}
                    >
                      <FontAwesomeIcon icon="circle-xmark" /> Cancel
                    </Button>
                    <Button onClick={handleCardDeckSave}>
                      <FontAwesomeIcon icon="plus-circle" /> Create Deck
                    </Button>
                  </Form>
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}

export default CardDecks
