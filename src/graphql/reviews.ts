import { gql } from '@apollo/client'

export const USER_REVIEWS = gql`
  query Reviews($teacherUserId: Int!) {
    reviews_public(where: { teacher_user_id: { _eq: $teacherUserId } }) {
      rating
      review
      created_at
      id
      teacher_user_id
      student_user_id
      student_language {
        user {
          profile_image
          first_name
          last_name
        }
      }
    }
  }
`

export const USER_REVIEWS_AGGREGATE = gql`
  query ReviewsAggregate(
    $studentUserId: Int!
    $teacherUserId: Int!
    $languageId: Int!
  ) {
    reviews_public_aggregate(
      where: {
        student_user_id: { _eq: $studentUserId }
        teacher_user_id: { _eq: $teacherUserId }
      }
    ) {
      aggregate {
        count
      }
    }
    users_private {
      user_languages {
        teachers(
          where: {
            language_teacher: {
              user_id: { _eq: $teacherUserId }
              language_id: { _eq: $languageId }
            }
          }
        ) {
          language_teacher {
            user_id
          }
        }
      }
    }
  }
`

export const USER_REVIEWS_CREATE = gql`
  mutation CreateReview(
    $rating: Int!
    $review: String!
    $studentTeacherId: Int!
  ) {
    insert_reviews(
      objects: {
        rating: $rating
        review: $review
        student_teacher_id: $studentTeacherId
      }
    ) {
      returning {
        id
      }
    }
  }
`
