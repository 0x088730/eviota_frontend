import React, { useState, useEffect } from 'react'
import { useMixpanel } from 'react-mixpanel-browser'
import { Tabs, Tab, Form, Row, Col } from 'react-bootstrap'
import { useCurrentUser, useBooking } from '../hooks'
import {
  BookingList,
  PageLoader,
  TeacherOnlineToggleModal,
  Alert,
  ActionsChecklist,
  CardReview,
} from '../components'

const Dashboard = () => {
  const mixpanel = useMixpanel()

  const [tab, setTab] = useState('student')
  const [showOnlineModal, setShowOnlineModal] = useState<boolean>(false)

  useEffect(() => mixpanel.track('Loaded dashboard'), [mixpanel])

  const { currentUser, isCurrentUserAvailable, error } = useCurrentUser()
  const { state } = useBooking({
    error: undefined,
    tasks: [],
  })

  return (
    <>
      <Row>
        <Col md={6} className="mb-2">
          <CardReview  style={{height: '100%'}} />
        </Col>
        <Col md={6} className="mb-2">
          <ActionsChecklist style={{height: '100%'}} />
        </Col>
      </Row>
      {error ? (
        <Alert error={error} />
      ) : !(
          isCurrentUserAvailable() && state.tasks.includes('fetched_bookings')
        ) ? (
        <PageLoader />
      ) : (
        <>
          <TeacherOnlineToggleModal
            checkinTimestamp={currentUser.checkin_timestamp}
            show={showOnlineModal}
            onClose={() => setShowOnlineModal(false)}
          />
          <Tabs
            activeKey={tab}
            onSelect={(t) => setTab(t as string)}
            className="mb-3"
          >
            <Tab eventKey="student" title="Student">
              <BookingList
                bookings={state.bookings}
                role="student"
                user={currentUser}
              />
            </Tab>
            <Tab eventKey="teacher" title="Teacher">
              <Form>
                <Form.Check
                  type="switch"
                  id="checkin-switch"
                  checked={!!currentUser.checkin_timestamp}
                  onChange={() => setShowOnlineModal(true)}
                  label={
                    <span id="checkin-label">
                      I am{' '}
                      <span style={{ textDecoration: 'underline' }}>
                        online
                      </span>{' '}
                      and{' '}
                      <span style={{ textDecoration: 'underline' }}>
                        available to teach
                      </span>
                    </span>
                  }
                  className="mb-3"
                />
              </Form>
              <BookingList
                bookings={state.bookings}
                role="teacher"
                user={currentUser}
              />
            </Tab>
          </Tabs>
        </>
      )}
    </>
  )
}

export default Dashboard
