import React, { useEffect, useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import {
  Container,
  Modal,
  Row,
  Col,
  Badge,
  Button,
  Form,
  Image,
} from 'react-bootstrap'
import { useMixpanel } from 'react-mixpanel-browser'
import { useNavigate, useParams } from 'react-router-dom'
import { sum } from 'lodash'
import {
  USER_DETAILS,
  USER_REVIEWS,
  USER_REVIEWS_AGGREGATE,
  USER_REVIEWS_CREATE,
  USER_TEACHER,
} from '../graphql'
import { ImageWithPlaceholder, ReviewDisplay, Rating } from '../components'
import { findCountryByCode } from '../lib/country-codes'
import { useCurrentUser } from '../hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback } from 'react'

// TODO: Check if user actually had a lesson with the teacher (via users_private ...)
// TODO: Hardcoded language ID here. Update when supporting other languages.
const LANGUAGE_ID = 2

const TeacherProfile = (props: any) => {
  const mixpanel = useMixpanel()
  const navigate = useNavigate()

  const { id: userIdString } = useParams()
  const userId = parseInt(userIdString || '')
  const [user, setUser] = useState<any>({})
  const [reviews, setReviews] = useState([])
  const [reviewByCurrentUserCount, setReviewByCurrentUserCount] = useState({})
  const [showCreateReviewModal, setShowCreateReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [studentTeacherId, setStudentTeacherId] = useState<number | undefined>(
    undefined
  )
  const [userReview, setUserReview] = useState('')
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false)

  const { currentUser, isCurrentUserAvailable } = useCurrentUser()
  const [
    createReview,
    {
      loading: loadingCreateReview,
      /*
      data: createReviewData,
      error: createReviewError,
      */
    },
  ] = useMutation(USER_REVIEWS_CREATE)

  const { loading: loadingUser, data: userData } = useQuery(USER_DETAILS, {
    variables: {
      userId,
    },
  })

  const [
    getUserTeachers,
    { 
      //loading: loadingUserTeachers,
      data: userTeachersData
    },
  ] = useLazyQuery(USER_TEACHER)

  const [getReviews, { loading: loadingReviews, data: reviewData }] =
    useLazyQuery(USER_REVIEWS)

  const [
    getReviewAggregate,
    { loading: loadingReviewAggregate, data: reviewAggregateData },
  ] = useLazyQuery(USER_REVIEWS_AGGREGATE)

  useEffect(() => mixpanel.track('Loaded Teacher Profile page'), [mixpanel])

  useEffect(() => {
    if (!(userData && isCurrentUserAvailable())) {
      return
    }
    const user = userData.users_by_pk
    setUser(user)
    getReviews({
      variables: {
        teacherUserId: user.id,
      },
    })
    getReviewAggregate({
      variables: {
        teacherUserId: user.id,
        studentUserId: currentUser.user_id,
        languageId: LANGUAGE_ID,
      },
    })
    getUserTeachers({
      variables: {
        teacherUserId: user.id,
        languageId: LANGUAGE_ID,
      },
    })
  }, [
    currentUser.user_id,
    getReviewAggregate,
    getReviews,
    getUserTeachers,
    isCurrentUserAvailable,
    userData,
  ])

  useEffect(() => {
    if (!reviewData) {
      return
    }
    setReviews(reviewData.reviews_public)
  }, [reviewData])

  useEffect(() => {
    if (!reviewAggregateData) {
      return
    }
    setReviewByCurrentUserCount(
      reviewAggregateData.reviews_public_aggregate.aggregate.count
    )
  }, [reviewAggregateData])

  useEffect(() => {
    if (!userTeachersData) {
      return
    }

    // Fetch nested data from results.
    const usersPrivate = userTeachersData.users_private
    if (usersPrivate.length) {
      const userLanguages = usersPrivate[0].user_languages
      if (userLanguages.length) {
        const userTeachers = userLanguages[0].teachers
        if (userTeachers.length) {
          setStudentTeacherId(userTeachers[0].id)
        }
      }
    }
  }, [userTeachersData])

  const handleReviewChange = useCallback(
    (event) => {
      setUserReview(event.target.value)
    },
    [setUserReview]
  )

  return (
    <>
      <Modal
        show={showCreateReviewModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => setShowCreateReviewModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {!isReviewSubmitted ? 'New Review' : 'Thank you'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isReviewSubmitted ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  name="review"
                  as="textarea"
                  rows={5}
                  placeholder="Write your review here ..."
                  onChange={handleReviewChange}
                  defaultValue={''}
                />
              </Form.Group>
              <Rating
                rating={5}
                size="2x"
                editable={true}
                showText={true}
                onChange={(rating) => setReviewRating(rating)}
              />
            </Form>
          ) : (
            <>
              <span>
                Your review is pending. You will receive{' '}
                <Image
                  style={{ height: '1em', width: '1em' }}
                  className="align-middle"
                  src={process.env.REACT_APP_KIN_LOGO_URL}
                />{' '}
                rewards once your review has been approved.
              </span>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setShowCreateReviewModal(false)}
            variant="secondary"
          >
            <FontAwesomeIcon icon="circle-xmark" /> Close
          </Button>

          {!isReviewSubmitted && (
            <Button
              onClick={() => {
                createReview({
                  variables: {
                    rating: reviewRating,
                    review: userReview,
                    studentTeacherId,
                  },
                }).then(() => setIsReviewSubmitted(true))
              }}
              disabled={loadingCreateReview || !userReview}
            >
              Create Review
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Container>
        {!loadingUser && user && user.languages && (
          <Row md={2}>
            <Col md={2}>
              <ImageWithPlaceholder
                id="file-input"
                roundedCircle={true}
                fluid
                image={
                  user.profile_image
                    ? `${process.env.REACT_APP_GOOGLE_CLOUD_PROFILE_IMAGE_BASE_URL}/${user.profile_image}`
                    : ''
                }
                style={{
                  height: '100px',
                  width: '100px',
                  marginBottom: '1rem',
                }}
              />
            </Col>
            <Col md={8}>
              <h3>{user.first_name ?? 'Unknown'}</h3>
              <>
                {user.from_country && (
                  <div className="mt-2">
                    From {findCountryByCode(user.from_country)}
                  </div>
                )}
              </>
              <>
                {user.living_country &&
                  user.from_country !== user.living_country && (
                    <div className="mt-2">
                      Living in {findCountryByCode(user.living_country)}
                    </div>
                  )}
              </>
              <div className="mt-2 mb-2">
                Teaches{' '}
                {user.languages
                  .filter((userLanguage) => userLanguage.is_teaching)
                  .map((userLanguage) => (
                    <Badge
                      key={userLanguage.id}
                      className="language-badge"
                      style={{ marginLeft: '0.3rem' }}
                      onClick={() =>
                        navigate(`../new-booking/${userLanguage.id}`)
                      }
                    >
                      {userLanguage.language.display_name}{' '}
                    </Badge>
                  ))}
              </div>
            </Col>
            <Col md={2} className="text-md-end">
              {sum(user.languages.map((l) => l.meta.lesson_count_as_teacher))}{' '}
              lessons
            </Col>
          </Row>
        )}
        <hr />

        <Row>
          <Col>
            <h3 className="mt-2 mb-3">About Me</h3>
            {!(user.teacher_profile && user.teacher_profile.introduction) ? (
              <p style={{ color: '#9c9cac' }}>
                Teacher has not filled out their "About Me".
              </p>
            ) : (
              <p>{user.teacher_profile.introduction}</p>
            )}
          </Col>
        </Row>
        {!loadingReviews && !loadingReviewAggregate && (
          <Row>
            <Col>
              <hr />
              {reviewByCurrentUserCount === 0 && studentTeacherId && (
                <Button
                  onClick={() => setShowCreateReviewModal(true)}
                  className="float-end"
                  disabled={isReviewSubmitted}
                >
                  Add a review
                </Button>
              )}
              <h3 className="mb-4">Reviews</h3>
              {!reviews.length ? (
                <span style={{ color: '#9c9cac' }}>
                  There are no reviews for this teacher yet.
                </span>
              ) : (
                reviews.map((review: any, i: number) => (
                  <div style={{ marginBottom: '2em' }}>
                  <ReviewDisplay
                    key={review.id}
                    rating={Math.round(review.rating)}
                    review={review.review}
                    reviewerProfileImage={
                      review.student_language.user.profile_image
                    }
                    timestamp={review.created_at}
                  />
                  {(i !== reviews.length - 1) && <hr />}
                  </div>
                ))
              )}
            </Col>
          </Row>
        )}
      </Container>
    </>
  )
}

export default TeacherProfile
