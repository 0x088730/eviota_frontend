import React, { useState, useEffect } from 'react'
import { useSubscription, useMutation } from '@apollo/client'
import { Card, Button } from 'react-bootstrap'
import { CARD_REVIEW_SET, CARD_REVIEW_ADD } from '../graphql'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CardBox from './card-section'
import CardBackBox from './card-back-section'
import { gsap } from "gsap/dist/gsap";

export const CardReview = (props) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const {
    data: cardsReview,
    loading: cardsReviewLoading,
  } = useSubscription(CARD_REVIEW_SET)

  const [
    addCardReview,
    {
      loading: cardsReviewAddLoading,
    },
  ] = useMutation(CARD_REVIEW_ADD)

  const handleResponseQualitySubmit = async (cardId, responseQuality) => {
    await addCardReview({
      variables: {
        cardId,
        responseQuality,
      },
    })
    setIsFlipped(false)
  }

  useEffect(() => {
  }, [])
  
  const flipCard = () => {
    gsap.to('.flip-card-inner', {duration: .5, rotationY: 180})
    setIsFlipped(true);
  }
  
  return (
    <Card {...props} disabled={cardsReviewLoading}>
      <Card.Body>
        {cardsReview &&
          cardsReview.cards_review &&
          (cardsReview.cards_review.length === 0 ? (
            <Card.Title className="text-center">No cards to review</Card.Title>
          ) : (
            cardsReview.cards_review.map((cardReview) => (
              <span key={cardReview.id}>
                <Card.Title className="text-center d-flex justify-content-center">
                  <div className="flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <CardBox value={cardReview.side1}></CardBox>
                      </div>
                      <div className="flip-card-back">
                        <CardBackBox value={cardReview.side2}></CardBackBox>
                      </div>
                    </div>
                  </div>
                </Card.Title>

                <Card.Footer className="text-center">
                  <Button hidden={isFlipped} onClick={() => flipCard()}>
                    <FontAwesomeIcon icon="arrow-turn-up" /> Reveal
                  </Button>

                  {[...Array(5)].map((_, idx) => (
                    <Button
                      hidden={!isFlipped}
                      key={idx}
                      className="me-1"
                      onClick={() => {
                        handleResponseQualitySubmit(cardReview.id, idx + 1)
                      }}
                      disabled={cardsReviewAddLoading}
                    >
                      {idx + 1}
                    </Button>
                  ))}
                </Card.Footer>
              </span>
            ))
          ))}
      </Card.Body>
    </Card>
  )
}

export default CardReview
