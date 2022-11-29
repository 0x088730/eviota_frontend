import { gql } from '@apollo/client'

export const CARD_DECKS = gql`
  query userDecks {
    decks(order_by: { created_at: asc }) {
      created_at
      id
      name
      cards_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`

export const CARD_DECKS_CREATE = gql`
  mutation createDeck($deckName: String!, $userLanguageId: Int!) {
    insert_decks_one(
      object: { name: $deckName, user_language_id: $userLanguageId }
    ) {
      id
    }
  }
`

export const CARD_DECKS_UPDATE = gql`
  mutation updateDeck($deckId: Int!, $deckName: String!) {
    update_decks_by_pk(pk_columns: { id: $deckId }, _set: { name: $deckName }) {
      id
    }
  }
`

export const CARD_DECKS_DELETE = gql`
  mutation deleteDeck($deckId: Int!) {
    delete_cards(where: { deck_id: { _eq: $deckId } }) {
      affected_rows
    }
    delete_decks_by_pk(id: $deckId) {
      id
    }
  }
`

export const CARDS_BY_DECK = gql`
  subscription deckCards($deckId: Int!) {
    cards(where: { deck_id: { _eq: $deckId } }) {
      e_factor
      id
      interval
      last_review
      repetitions
      side1
      side2
    }
  }
`

export const CARD_CREATE = gql`
  mutation createCard($deckId: Int!, $side1: String!, $side2: String!) {
    insert_cards(objects: { deck_id: $deckId, side1: $side1, side2: $side2 }) {
      affected_rows
    }
  }
`

export const CARD_UPDATE = gql`
  mutation updateCard($cardId: Int!, $side1: String!, $side2: String!) {
    update_cards_by_pk(
      pk_columns: { id: $cardId }
      _set: { side1: $side1, side2: $side2 }
    ) {
      id
    }
  }
`

export const CARD_DELETE = gql`
  mutation deleteCard($cardId: Int!) {
    delete_cards_by_pk(id: $cardId) {
      id
    }
  }
`

export const CARD_REVIEW_SET = gql`
  subscription CardReviewSet {
    cards_review(
      where: { next_review_date: { _lte: "now()" } }
      order_by: { next_review_date: desc }
      limit: 1
    ) {
      created_at
      deck_id
      deck_name
      e_factor
      last_review
      next_review_date
      repetitions
      side1
      side2
      interval
      id
    }
  }
`

export const CARD_REVIEW_ADD = gql`
  mutation CardReview($cardId: Int!, $responseQuality: Int!) {
    review_card(card_id: $cardId, response_quality: $responseQuality) {
      card {
        id
      }
    }
  }
`
