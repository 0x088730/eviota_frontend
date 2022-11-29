import { gql } from '@apollo/client'

export const BOOKINGS_ONGOING = gql`
  subscription ongoingBookings($statusIn: [String!]) {
    bookings(
      order_by: { updated_at: desc }
      where: { _and: { status: { _in: $statusIn } } }
    ) {
      id
      created_at
      updated_at
      status
      room_details
      student_teacher {
        language_teacher {
          id
          user {
            id
            first_name
            wallet_public_key
            teacher_profile
            profile_image
          }
          language {
            id
            code
            display_name
          }
        }
        language_student {
          id
          user {
            id
            first_name
            profile_image
          }
          language {
            code
            display_name
            id
          }
        }
      }
    }
  }
`

export const STUDENT_TEACHER_CREATE = gql`
  mutation upsertStudentTeacher($payload: student_teachers_insert_input!) {
    insert_student_teachers_one(
      object: $payload
      on_conflict: {
        constraint: student_teachers_student_id_teacher_id_key
        update_columns: []
      }
    ) {
      id
      student_id
      teacher_id
    }
  }
`

export const BOOKING_CREATE = gql`
  mutation createBooking($payload: bookings_insert_input!) {
    insert_bookings_one(object: $payload) {
      id
      student_teacher_id
      status
    }
  }
`

export const STUDENT_TEACHER = gql`
  query studentTeacher($studentId: Int!, $teacherId: Int!) {
    student_teachers(
      where: {
        student_id: { _eq: $studentId }
        teacher_id: { _eq: $teacherId }
      }
    ) {
      id
    }
  }
`

export const BOOKING_UPDATE = gql`
  mutation updateBookingState($bookingId: Int!, $payload: bookings_set_input!) {
    update_bookings_by_pk(pk_columns: { id: $bookingId }, _set: $payload) {
      id
    }
  }
`

export const LESSON_DETAIL_SUBSCRIPTION = gql`
  subscription lessonDetails($lessonId: Int!) {
    lessons(where: { id: { _eq: $lessonId } }) {
      id
      session_id
      start
      end
      lesson_media {
        id
        media {
          id
          type
          content
          status
        }
      }
      booking {
        room_details
        student_teacher {
          language_student {
            id
            user {
              id
              first_name
              last_name
              profile_image
            }
            language {
              display_name
            }
          }
          language_teacher {
            id
            user {
              id
              first_name
              last_name
              profile_image
            }
          }
        }
      }
    }
  }
`

export const COMPLETED_LESSONS_SUBSCRIPTION = gql`
  subscription completedLessons($limit: Int!, $offset: Int!) {
    lessons(
      where: { end: { _is_null: false } }
      order_by: { end: desc }
      limit: $limit
      offset: $offset
    ) {
      session_id
      id
      start
      end
      booking {
        student_teacher {
          language_teacher {
            id
            user {
              id
              first_name
              last_name
              profile_image
            }
            language {
              display_name
            }
          }
        }
      }
    }
  }
`
