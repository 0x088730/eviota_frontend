import React, { useCallback } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Booking } from '.'

const BookingList = ({ user, bookings, role }) => {
  
  const filteredBookings = useCallback(() => bookings.filter(booking =>
    booking.student_teacher[`language_${role}`].user.id === user.user_id)
    , [bookings, role, user.user_id])

  return (
    <div>
      {(
        filteredBookings().length === 0
        ? <Row>
            <Col>
              <p className="text-center" style={{ color: '#9c9cac' }}>
                You don't have any bookings.
              </p>
            </Col>
          </Row>
        : filteredBookings().map((booking) =>
          <Booking booking={booking} role={role} key={booking.id} />)
      )}
    </div>
	)
}

export default BookingList
