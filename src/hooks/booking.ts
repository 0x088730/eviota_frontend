import { useCallback, useEffect, useReducer } from 'react'
import { useLazyQuery, useMutation, useSubscription } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { useCurrentUser } from '.'
import {
  BOOKINGS_ONGOING,
  TEACHER_DETAILS,
  STUDENT_TEACHER,
  STUDENT_TEACHER_CREATE,
  BOOKING_CREATE,
} from '../graphql'

const useDataEffect = ({
  include,
  exclude,
  data,
  loading,
  error,
  tasks,
  cb,
  otherDependencies,
}: {
  include: string[]
  exclude: string[]
  data: any
  loading: any
  error: any
  tasks: string[]
  cb: any
  otherDependencies?: unknown[]
}) => {
  return useEffect(() => {
    if (!include.every((i) => tasks.includes(i))) {
      return
    }
    if (exclude.some((e) => tasks.includes(e))) {
      return
    }
    if (error) {
      console.error(error)
    }
    if (!data || loading || error) {
      return
    }
    cb(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, ...(otherDependencies || [])])
}

export const useBooking = (initialState: any) => {
  const navigate = useNavigate()
  const navigateHome = useCallback(
    () => navigate('/', { replace: true }),
    [navigate]
  )

  const {
    currentUser,
    loading: userLoading,
    error: userError,
    isCurrentUserAvailable,
  } = useCurrentUser()

  const [
    getStudentTeacher,
    {
      data: studentTeachers,
      loading: studentTeacherLoading,
      error: studentTeacherError,
    },
  ] = useLazyQuery(STUDENT_TEACHER)

  const [
    getTeacherDetails,
    {
      data: teacherDetails,
      loading: teacherDetailsLoading,
      error: teacherDetailsError,
    },
  ] = useLazyQuery(TEACHER_DETAILS)

  const [
    createBooking,
    {
      data: createBookingData,
      loading: createBookingLoading,
      error: createBookingError,
    },
  ] = useMutation(BOOKING_CREATE)

  const [
    upsertStudentTeacher,
    {
      data: studentTeacherUpsertData,
      loading: studentTeacherSaving,
      error: studentTeacherSaveError,
    },
  ] = useMutation(STUDENT_TEACHER_CREATE)

  const {
    data: bookingsData,
    loading: bookingsLoading,
    error: bookingsError,
  } = useSubscription(BOOKINGS_ONGOING, {
    variables: {
      statusIn: [
        'pending',
        'cancelled',
        'rejected',
        'accepted',
        'paid',
        'expired',
      ],
    },
  })

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case 'set': {
        return {
          ...state,
          ...payload,
        }
      }
      case 'add_task': {
        return {
          ...state,
          tasks: mergeTask(state, payload),
        }
      }
      case 'set_is_loading': {
        return {
          ...state,
          isLoading: payload,
        }
      }
      case 'set_error': {
        return {
          ...state,
          error: payload,
        }
      }
      case 'get_teacher_details': {
        getTeacherDetails({
          variables: payload,
        })

        return {
          ...state,
          ...payload,
        }
      }
      case 'confirm_booking': {
        upsertStudentTeacher({
          variables: {
            payload: {
              student_id: state.studentLanguageId,
              teacher_id: state.teacherLanguageId,
            },
          },
        })

        return {
          ...state,
        }
      }

      case 'get_student_teacher': {
        getStudentTeacher({
          variables: {
            studentId: state.studentLanguageId,
            teacherId: state.teacherLanguageId,
          },
        })

        return {
          ...state,
        }
      }

      case 'create_booking': {
        createBooking({
          variables: {
            payload: {
              student_teacher_id: state.studentTeacherId,
            },
          },
        })

        return {
          ...state,
        }
      }

      default:
        throw new Error(`Undefined action type: ${type}`)
    }
  }

  const mergeTask = (state, task) => [
    ...state.tasks,
    ...(!state.tasks.includes(task) ? [task] : []),
  ]

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!_.isEmpty(currentUser)) {
      dispatch({ type: 'add_task', payload: 'fetched_current_user' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentUserAvailable()])

  useDataEffect({
    tasks: state.tasks,
    include: ['requested_teacher'],
    exclude: ['fetched_target_language'],
    data: teacherDetails,
    loading: teacherDetailsLoading,
    error: teacherDetailsError,
    cb: (d) => {
      dispatch({
        type: 'set',
        payload: { languageId: d.user_languages[0].language.id },
      })
      dispatch({ type: 'add_task', payload: 'fetched_target_language' })
    },
  })

  useDataEffect({
    tasks: state.tasks,
    include: ['fetched_target_language'],
    exclude: ['fetched_student_language_id'],
    data: currentUser,
    loading: userLoading,
    error: userError,
    otherDependencies: [state.tasks],
    cb: (d) => {
      const studentLanguageId = d.user_languages.filter(
        (l) => l.language.id === state.languageId
      )[0].id
      dispatch({ type: 'set', payload: { studentLanguageId } })
      dispatch({ type: 'add_task', payload: 'fetched_student_language_id' })
    },
  })

  useDataEffect({
    tasks: state.tasks,
    include: [
      'initiated_student_teacher_upsert',
      'fetched_student_language_id',
    ],
    exclude: ['upserted_student_teacher'],
    data: studentTeacherUpsertData,
    loading: studentTeacherSaving,
    error: studentTeacherSaveError,
    cb: (d) => {
      dispatch({ type: 'add_task', payload: 'upserted_student_teacher' })
      dispatch({ type: 'add_task', payload: 'requested_student_teacher' })
      dispatch({ type: 'get_student_teacher', payload: {} })
    },
  })

  useDataEffect({
    tasks: state.tasks,
    include: ['requested_student_teacher'],
    exclude: ['student_teacher_id_set', 'initiated_create_booking'],
    data: studentTeachers,
    loading: studentTeacherLoading,
    error: studentTeacherError,
    cb: (d) => {
      dispatch({
        type: 'set',
        payload: {
          studentTeacherId: d.student_teachers[0].id,
        },
      })
      dispatch({ type: 'add_task', payload: 'student_teacher_id_set' })
      dispatch({ type: 'add_task', payload: 'initiated_create_booking' })
      dispatch({ type: 'create_booking', payload: {} })
    },
  })

  useDataEffect({
    tasks: state.tasks,
    include: ['initiated_create_booking'],
    exclude: ['booking_created'],
    data: createBookingData,
    loading: createBookingLoading,
    error: createBookingError,
    cb: (d) => {
      dispatch({
        type: 'set',
        payload: { bookingId: createBookingData.insert_bookings_one.id },
      })
      dispatch({ type: 'add_task', payload: 'booking_created' })
      navigateHome()
    },
  })

  useDataEffect({
    tasks: state.tasks,
    include: [],
    exclude: [],
    data: bookingsData,
    loading: bookingsLoading,
    error: bookingsError,
    cb: (d) => {
      dispatch({ type: 'set', payload: { bookings: bookingsData.bookings } })
      dispatch({ type: 'add_task', payload: 'fetched_bookings' })
    },
  })

  useEffect(() => {
    dispatch({
      type: 'set_is_loading',
      payload:
        userLoading ||
        studentTeacherLoading ||
        teacherDetailsLoading ||
        studentTeacherSaving ||
        bookingsLoading,
    })
  }, [
    userLoading,
    studentTeacherLoading,
    teacherDetailsLoading,
    studentTeacherSaving,
    bookingsLoading,
  ])

  useEffect(() => {
    dispatch({
      type: 'set_error',
      payload:
        (userError ? userError.message : undefined) ||
        (studentTeacherError ? studentTeacherError.message : undefined) ||
        (teacherDetailsError ? teacherDetailsError.message : undefined) ||
        (studentTeacherSaveError
          ? studentTeacherSaveError.message
          : undefined) ||
        (bookingsError ? bookingsError.message : undefined),
    })
  }, [
    userError,
    studentTeacherError,
    teacherDetailsError,
    studentTeacherSaveError,
    bookingsError,
  ])

  return { state, dispatch }
}
