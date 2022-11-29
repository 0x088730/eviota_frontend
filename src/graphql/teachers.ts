import { gql } from '@apollo/client'

export const ONLINE_TEACHERS = gql`
  query getOnlineTeachers($languageId: Int!, $offset: Int!, $limit: Int!) {
    online_teachers(
      where: {
        _and: {
          language_id: { _eq: $languageId }
          user: {
            wallet_public_key: { _is_null: false }
            teacher_profile: { _has_key: "teaching_fee_kin" }
          }
        }
      }
      offset: $offset
      limit: $limit
    ) {
      user {
        id
        first_name
        last_name
        profile_image
        teacher_profile
        from_country
        languages {
          id
          is_teaching
          proficiency
          language {
            id
            code
            display_name
          }
        }
        reviews {
          rating
        }
      }
    }
  }
`

export const TEACHER_DETAILS = gql`
  query TeacherDetail($teacherLanguageId: Int!) {
    user_languages(where: { id: { _eq: $teacherLanguageId } }) {
      id
      language {
        id
        display_name
        code
      }
      is_teaching
    }
  }
`

export const USER_TEACHER = gql`
  query GetUserTeacher($languageId: Int!, $teacherUserId: Int!) {
    users_private {
      user_languages(where: { language_id: { _eq: $languageId } }) {
        teachers(
          where: { language_teacher: { user_id: { _eq: $teacherUserId } } }
        ) {
          id
        }
      }
    }
  }
`
