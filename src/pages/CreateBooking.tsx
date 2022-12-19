import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useMixpanel } from 'react-mixpanel-browser'
import { useParams } from 'react-router-dom'
import { useBooking } from '../hooks'

const CreateBooking = () => {
  
  const mixpanel = useMixpanel()

  const { state: { error, isLoading, tasks, ...state }, dispatch } = useBooking({
    error: undefined,
    tasks: []
  })
  const { id: teacherLanguageIdString } = useParams()
  const teacherLanguageId = parseInt(teacherLanguageIdString || '')

  useEffect(() => mixpanel.track('Loaded Create Booking page'), [mixpanel])

  useEffect(() => {
    if (error) {
      console.error(error)
      return
    }
    if (isLoading) {
      return
    }
    if (tasks.length === 0) {
      dispatch({ type: 'add_task', payload: 'requested_teacher' })
      dispatch({ type: 'get_teacher_details', payload: { teacherLanguageId } })
    }
  }, [dispatch, error, isLoading, state, tasks, teacherLanguageId])

  return (
    <div>
      <div>
        <p>
          Confirming this booking will send the teacher an instant booking
          request.
        </p>
        <Button
          variant="primary"
          disabled={
            !tasks.includes('fetched_student_language_id')
            || tasks.includes('initiated_create_booking')
          }
          onClick={() => {
            dispatch({ type: 'confirm_booking', payload: {} })
            dispatch({ type: 'add_task', payload: 'initiated_student_teacher_upsert' })
          }}
        >
          Confirm Booking Request
        </Button>
      </div>
    </div>
  )
}

export default CreateBooking
