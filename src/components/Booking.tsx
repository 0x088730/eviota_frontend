/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react'
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Image,
  Form,
  InputGroup,
} from 'react-bootstrap'
import { ImageWithPlaceholder, KinPayment, KinBalance } from '.'
import { DateTime } from 'luxon'
import { useMutation } from '@apollo/client'
import { BOOKING_UPDATE } from '../graphql'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

const HIDE_ROOM_DETAILS_OLDER_THAN = { minutes: 90 }

const Booking = ({
  role,
  booking: {
    id: bookingId,
    updated_at,
    status,
    room_details,
    student_teacher: {
      language_teacher: {
        user: {
          wallet_public_key: teacher_wallet_public_key,
          id: teacher_user_id,
          teacher_profile: {
            teaching_fee_kin
          }
        },
      },
    },
    student_teacher: { language_teacher, language_student },
    ...props
  },
}) => {
  const updatedAt = DateTime.fromISO(updated_at).toLocal()
  const [statusUpdated, setStatusUpdated] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [zoomRoomUrl, setZoomRoomUrl] = useState('')
  const [isRoomEditMode, setIsRoomEditMode] = useState(false)

  const [
    updateBooking,
    {
      data: updateBookingData,
      loading: updateBookingLoading,
      error: updateBookingError,
    },
  ] = useMutation(BOOKING_UPDATE)

  useEffect(() => {
    if (status === 'paid') {
      setShowPaymentModal(false)
    }
  }, [status])

  const handleUpdateBooking = (payload) => {
    updateBooking({
      variables: {
        bookingId,
        payload,
      },
    })
  }

  const getProfileImage = useCallback(() => {
    const otherRole = role === 'student' ? language_teacher : language_student
    return otherRole.user.profile_image
      ? `${process.env.REACT_APP_GOOGLE_CLOUD_PROFILE_IMAGE_BASE_URL}/${otherRole.user.profile_image}`
      : ''
  }, [language_student, language_teacher, role])

  const ProfileImage = () => (
    <ImageWithPlaceholder
      image={getProfileImage()}
      roundedCircle={true}
      style={{ width: '55px', height: '55px' }}
    />
  )

  return (
    <>
      <KinPayment
        amount={teaching_fee_kin}
        to={teacher_wallet_public_key}
        modalTitle="Pay Teacher"
        showModal={showPaymentModal}
        foreignKey={bookingId}
        onClose={() => setShowPaymentModal(false)}
        confirmContent={
          <span>
            Pay{' '}
            <Image
              style={{ height: '1em', width: '1em', margin: '0 0.2em 0 0' }}
              className="align-middle"
              src={`${process.env.REACT_APP_KIN_LOGO_WHITE_URL}`}
            />
            {teaching_fee_kin}{' '}
          </span>
        }
        content={
          <span>
            <p>Please confirm the amount to send your teacher:</p>
            <KinBalance
              balance={teaching_fee_kin}
              displayUsdPrice={true}
            />
          </span>
        }
      />
      <Card className="mb-2">
        <Card.Body>
          <Container>
            <Row>
              <Col
                className="mb-2"
                style={{
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  letterSpacing: '.75px',
                  color: '#9c9cac',
                }}
              >
                {status}
              </Col>
            </Row>
            <Row>
              <Col xs={9}>
                <div style={{ display: 'flex', paddingRight: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {/* day */}
                    <span
                      style={{
                        fontSize: '24px',
                        fontWeight: 500,
                        lineHeight: 1.25,
                      }}
                    >
                      {updatedAt.toFormat('d')}
                    </span>
                    {/* month */}
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: 1.2,
                      }}
                    >
                      {updatedAt.toFormat('MMM')}
                    </span>
                  </div>
                  {/* divider */}
                  <div
                    style={{
                      display: 'inline-block',
                      margin: '8px 16px',
                      width: '1px',
                      background: '#f5f6f9',
                    }}
                  ></div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* time */}
                    <span>
                      <span
                        style={{
                          fontSize: '24px',
                          fontWeight: 500,
                          lineHeight: 1.25,
                        }}
                      >
                        {updatedAt.toFormat('hh:mm')}
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: 1.2,
                        }}
                      >
                        {' '}
                        {updatedAt.toFormat('a')}
                      </span>
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: '#9c9cac',
                      }}
                    >
                      {language_teacher.language.display_name}
                    </span>
                  </div>
                </div>
              </Col>
              <Col style={{ textAlign: 'right', alignItems: 'right' }}>
                {role === 'student' ? (
                  <Link to={`/teacher-profile/${teacher_user_id}`}>
                    <ProfileImage />
                  </Link>
                ) : (
                  <ProfileImage />
                )}
              </Col>
            </Row>

            {
              <Row className="mt-2">
                <Col>
                  {role === 'student' ? (
                    <>
                      {status === 'accepted' && (
                        <>
                          <p>
                            Please send your teacher payment to begin the
                            lesson.
                          </p>
                          {/* TODO: Need to insert a visible timer here */}
                          <Button
                            type="button"
                            onClick={() => setShowPaymentModal(true)}
                            className="me-2"
                          >
                            <FontAwesomeIcon icon="money-bill" /> Pay Teacher
                          </Button>
                        </>
                      )}
                      {!['cancelled', 'rejected', 'paid', 'expired'].includes(status) && (
                        <Button
                          type="button"
                          onClick={() =>
                            handleUpdateBooking({ status: 'cancelled' })
                          }
                          variant="secondary"
                        >
                          <FontAwesomeIcon icon="circle-xmark" /> Cancel Booking
                          Request
                        </Button>
                      )}

                      {status === 'paid' && (
                        <>
                          {!room_details ? (
                            <>
                              <Spinner
                                animation="border"
                                size="sm"
                                role="status"
                                style={{ marginRight: '0.2em' }}
                              />{' '}
                              Awaiting room details
                            </>
                          ) : (
                            <>
                              {updatedAt >=
                                DateTime.now().minus(
                                  HIDE_ROOM_DETAILS_OLDER_THAN
                                ) && (
                                <Button href={room_details.zoom_room_url}>
                                  <FontAwesomeIcon icon="video-camera" /> Launch
                                  Zoom Lesson
                                </Button>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    // Teacher
                    <>
                      {status === 'pending' && (
                        <>
                          <Button
                            type="button"
                            disabled={statusUpdated}
                            onClick={() =>
                              handleUpdateBooking({ status: 'accepted' })
                            }
                            className="me-2"
                          >
                            <FontAwesomeIcon icon="circle-check" /> Accept
                            Booking
                          </Button>
                          <Button
                            type="button"
                            disabled={statusUpdated}
                            className="btn-secondary"
                            onClick={() =>
                              handleUpdateBooking({ status: 'rejected' })
                            }
                          >
                            <FontAwesomeIcon icon="circle-xmark" /> Reject
                            Booking
                          </Button>
                        </>
                      )}
                      {status === 'accepted' && (
                        <span>
                          <Spinner size="sm" animation="border" />
                          <>&nbsp;&nbsp;</>Awaiting payment
                        </span>
                      )}
                      {status === 'paid' &&
                        updatedAt >=
                          DateTime.now().minus(
                            HIDE_ROOM_DETAILS_OLDER_THAN
                          ) && (
                          <>
                            {!room_details || isRoomEditMode ? (
                              <Form>
                                <InputGroup className="mt-2">
                                  <Form.Control
                                    type="text"
                                    placeholder="Zoom Link"
                                    value={
                                      zoomRoomUrl ||
                                      (room_details
                                        ? room_details.zoom_room_url
                                        : '')
                                    }
                                    onChange={(e) =>
                                      setZoomRoomUrl(e.target.value)
                                    }
                                  />
                                  <Button
                                    disabled={!zoomRoomUrl}
                                    onClick={() => {
                                      handleUpdateBooking({
                                        room_details: {
                                          zoom_room_url: zoomRoomUrl,
                                        },
                                      })
                                      setIsRoomEditMode(false)
                                    }}
                                  >
                                    Update Room
                                  </Button>
                                </InputGroup>
                              </Form>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    window.open(room_details.zoom_room_url)
                                  }
                                  className="me-2"
                                >
                                  <FontAwesomeIcon icon="video-camera" /> Launch
                                  Zoom
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setIsRoomEditMode(true)
                                  }}
                                >
                                  <FontAwesomeIcon icon="edit" /> Edit Zoom URL
                                </Button>
                              </>
                            )}
                          </>
                        )}
                    </>
                  )}
                </Col>
              </Row>
            }
          </Container>
        </Card.Body>
      </Card>
    </>
  )
}

export default Booking
