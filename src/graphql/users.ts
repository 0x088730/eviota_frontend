import { gql } from '@apollo/client'

export const USER_DETAILS_PRIVATE = gql`
  subscription UserDetails {
    users_private {
      user_id
      created_at
      dob
      email
      first_name
      from_city
      from_country
      gender
      last_name
      last_seen
      living_city
      living_country
      profile_image
      student_profile
      teacher_profile
      username
      wallet_public_key
      updated_at
      checkin_timestamp
      user_languages {
        id
        language {
          id
          display_name
          code
        }
        is_teaching
        meta {
          lesson_count_as_student
          lesson_count_as_teacher
        }
      }
      actions {
        key
        metadata
        created_at
      }
      notifications(
        where: { status: { _neq: "dismissed" } }
        order_by: { created_at: desc }
      ) {
        id
        title
        description
        status
        created_at
      }
    }
  }
`

export const USER_PRIVATE_SAVE = gql`
  mutation UpdateUser($payload: users_private_set_input, $userId: Int) {
    update_users_private(
      _set: $payload
      where: { _and: { user_id: { _eq: $userId } } }
    ) {
      affected_rows
      returning {
        user_id
      }
    }
  }
`

export const USER_DETAILS = gql`
  query UserDetail($userId: Int!) {
    users_by_pk(id: $userId) {
      id
      first_name
      from_city
      from_country
      gender
      profile_image
      checkin_timestamp
      last_name
      living_city
      living_country
      student_ratings_avg
      teacher_profile
      wallet_public_key
      last_seen
      languages {
        id
        is_teaching
        language {
          code
          display_name
          id
        }
        meta {
          lesson_count_as_teacher
          user_language_id
        }
      }
    }
  }
`
