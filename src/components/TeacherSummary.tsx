import React, { useState } from 'react'
import _ from 'lodash'
import {
  Container,
  Row,
  Col,
  Button,
  Tabs,
  Tab,
  Card,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  ImageWithPlaceholder,
  Rating,
  VideoEmbedWidget,
  CountryFlag
} from '../components'
import { useNavigate } from 'react-router-dom'

// TODO: Move these defs elsewhere ...

type UserLanguage = {
  id?: number
  is_teaching?: string
  proficiency?: string
  language?: Language
}

type Language = {
  id?: number
  code?: string
  display_name?: string
}

type Review = {
  rating?: number
  review?: string
}

type Teacher = {
  id?: string
  first_name?: string
  last_name?: string
  profile_image?: string
  from_country?: string
  teacher_profile: {
    video_url?: string
    introduction?: string
    teaching_fee?: number
  }
  languages?: UserLanguage[]
  reviews?: Review[]
}

const TeacherSummary = (props: { teacher: Teacher, languageId: number }) => {
  const navigate = useNavigate()
  const [tab, setTab] = useState('bio')

  const {
    teacher: {
      id: teacherUserId,
      first_name,
      last_name,
      profile_image,
      reviews,
      from_country,
      teacher_profile,
    },
    languageId
  } = props

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row>
          <Col md={6} xl={5}>
            <Container>
              <Row className="mt-3">
                <Col style={{ textAlign: 'center', alignItems: 'center' }}>
                  <ImageWithPlaceholder
                    image={
                      profile_image
                        ? `${process.env.REACT_APP_GOOGLE_CLOUD_PROFILE_IMAGE_BASE_URL}/${profile_image}`
                        : ''
                    }
                    preview_image="images/placeholder-avatar.png"
                    roundedCircle={true}
                    style={{ width: '150px', height: '150px' }}
                  />
                  <div>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {from_country && <span><CountryFlag countryCode={from_country} /> </span>}
                      {first_name} {last_name}
                    </span>
                    <div>
                      {reviews && reviews.length > 0 &&
                        <Rating
                          rating={Math.round(_.mean(reviews.map((review) => review.rating)))}
                        />
                      }
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col md={6} xl={7}>
            <Tabs
              id="teacher-tabs"
              activeKey={tab}
              onSelect={(tab: any) => setTab(tab)}
              variant="pills"
            >
              <Tab eventKey="bio" title="Bio">
                <p>{
                !(teacher_profile && teacher_profile.introduction) 
                ? 'No bio' 
                : teacher_profile.introduction
                }</p>
              </Tab>
              {
                teacher_profile && teacher_profile.video_url && 
                <Tab eventKey="video" title="Video">
                  <VideoEmbedWidget title="Introduction video" url={teacher_profile.video_url} />
                </Tab>
              }
            </Tabs>
          </Col>
        </Row>
        <Row>
          <Col md={7}>
            <Button
              variant="primary"
              style={{ width: '100%' }}
              className="mt-3"
              onClick={() => navigate(`../new-booking/${languageId}`)}
            >
              <FontAwesomeIcon icon="book" style={{ marginRight: '0.5rem' }} />
              Book now!
            </Button>
          </Col>
          <Col md={5}>
            <Button
              variant="dark"
              style={{ width: '100%' }}
              className="mt-3"
              onClick={() => navigate(`../teacher-profile/${teacherUserId}`)}
              >
              <FontAwesomeIcon
                icon="user-circle"
                style={{ marginRight: '0.5rem' }}
              />
              View Profile
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default TeacherSummary
