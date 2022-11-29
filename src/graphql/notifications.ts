import { gql } from '@apollo/client'

export const NOTIFICATIONS_UPDATE = gql`
  mutation updateCard($notificationId: Int!, $status: String!) {
    update_notifications_by_pk(
      pk_columns: { id: $notificationId }
      _set: { status: $status }
    ) {
      id
    }
  }
`
