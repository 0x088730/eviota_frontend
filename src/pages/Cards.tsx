import React, { useEffect, useState } from 'react'
import { useMixpanel } from 'react-mixpanel-browser'
import { useNavigate, useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/client'
import { Row, Col, Breadcrumb, ListGroup } from 'react-bootstrap'
import { CardRow } from '../components'
import { CARDS_BY_DECK } from '../graphql'
import Spinner from 'react-bootstrap/Spinner';

const Cards = () => {
  const mixpanel = useMixpanel()
  const navigate = useNavigate()

  useEffect(() => mixpanel.track('Loaded cards'), [mixpanel])
  const { id: deckIdString } = useParams()
  const [keySpinner, SetKeySpinner] = useState(false)
  const {
    data: cardsData,
  } = useSubscription(CARDS_BY_DECK, {
    variables: {
      deckId: Number.parseInt(deckIdString || ''),
    },
  });

  const onChange = () => {
    SetKeySpinner(false)
  }

  const setChange = () => {
    SetKeySpinner(true)
  }


  return (
    <>
      <Row>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => navigate('/card-decks')}>
              Decks
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Deck Name</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <ListGroup className="my-2">
            <ListGroup.Item>
              <CardRow
                deckId={Number.parseInt(deckIdString || '')}
                isNew={true}
                onChange={onChange}
                setChange={setChange}
              />
            </ListGroup.Item>
            {cardsData && (
              <>
                {cardsData.cards.map((card, idx) => (
                  <ListGroup.Item key={card.id}>
                    <CardRow
                      deckId={Number.parseInt(deckIdString || '')}
                      card={card}
                    />
                  </ListGroup.Item>
                ))}
              </>
            )}
          </ListGroup>
          {
            keySpinner === true ? <div style={{ position: 'absolute', width: '100vw', height: '100vh', backgroundColor: 'rgba(240, 240, 245, 0.7)', top: '0', right: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div> : null
          }
        </Col>
      </Row>
    </>
  )
}

export default Cards
