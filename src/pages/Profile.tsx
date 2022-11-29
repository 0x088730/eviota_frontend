import React, { useState, useEffect, useCallback, useContext } from 'react'
import _ from 'lodash'
import { useAuth0 } from '@auth0/auth0-react'
import { useMixpanel } from 'react-mixpanel-browser'
import {
  Row,
  Col,
  Form,
  Tabs,
  Tab,
  Button,
  Alert,
  InputGroup,
} from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { EviotaApi } from '../lib/eviota-api'
import { USER_PRIVATE_SAVE } from '../graphql'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ImageWithPlaceholder, PageLoader } from '../components'
import { useCurrentUser } from '../hooks'
import { countryCodes } from '../lib/country-codes'
import { KinContext } from '../lib/kin-client'

type UserState = {
  user_id?: string
  first_name?: string
  last_name?: string
  from_country?: string
  profile_image?: string
  teacher_profile?: {
    introduction?: string
    video_url?: string
    teaching_fee_kin?: number
  }
  student_profile?: {
    introduction?: string
  }
}

const Profile = () => {
  const { currentUser, isCurrentUserAvailable, error: currentUserError } = useCurrentUser()
  
  const countryCodeLookup = useCallback(() => countryCodes, [])

  const mixpanel = useMixpanel()
  const [
    saveProfile,
    {
      loading: savingProfileData
    },
  ] = useMutation(USER_PRIVATE_SAVE)
  const { getAccessTokenSilently } = useAuth0()
  const [user, setUser] = useState<UserState>({})
  const [avatar, setAvatar] = useState({
    imagePreview: '',
    imageFile: '',
  })
  const [tab, setTab] = useState('student')
  const [teachingFeeUsd, setTeachingFeeUsd] = useState(0)
  const [alert, setAlert] = useState({
    display: false,
    variant: 'success',
    text: ''
  })

  const handleUserChange = (event) => {
    const { value, name } = event.target
    const userNew = _.cloneDeep(user)
    _.set(userNew, name, value)
    setUser(userNew)
  }

  const handleImagePreview = (e) => {
    const imageFile = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(imageFile)
    reader.onload = (event) => {
      const imagePreview = (event as any).target.result
      setAvatar({
        imagePreview,
        imageFile,
      })
    }
  }

  const handleSave = async () => {
    const { profile_image, ...payload } = user

    try {
      const result = await saveProfile({
        variables: {
          userId: currentUser.user_id,
          payload,
        },
      })

      if (result.data.update_users_private.affected_rows === 1) {
        mixpanel.track('User saved profile', { userId: currentUser.user_id, ...user })
        setAlert({
          variant: 'success',
          display: true,
          text: 'Profile changes saved.'
        })

      } else {
        throw Error('Profile update failed.')
      }

      if (avatar.imageFile) {
        mixpanel.track('User uploaded an avatar', { userId: currentUser.user_id })
        uploadFile()
      }

    } catch (error) {
      setAlert({
        variant: 'danger',
        display: true,
        text: 'An error occured whilst updating your profile :-('
      })
    }
  }

  const uploadFile = async () => {
    if (!avatar.imageFile) {
      throw Error('Unable to upload file. Falsey file input.')
    }

    const formData = new FormData()
    formData.append('file', avatar.imageFile)
    await EviotaApi({
      baseUrl: process.env.REACT_APP_API_BASE_URL || '',
      accessToken: await getAccessTokenSilently(),
    }).postProfile(formData)
  }

  useEffect(() => {
    if (!currentUser) {
      return
    }

    const {
      first_name,
      last_name,
      from_country,
      student_profile,
      teacher_profile,
      profile_image,
    } = currentUser

    setUser({
      first_name,
      last_name,
      from_country,
      student_profile,
      teacher_profile,
      profile_image,
    })
  }, [currentUser])

  useEffect(() => mixpanel.track('Visited Own Profile'), [mixpanel])

  const kinContext = useContext(KinContext)

  const refreshUsdPrice = useCallback(async () => {
    const prices = await kinContext.getPrices()
    if (!_.has(user, 'teacher_profile.teaching_fee_kin')) {
      return
    }
    if (prices && prices.kin && prices.kin.usd) {
      setTeachingFeeUsd(user.teacher_profile!.teaching_fee_kin! * prices.kin.usd)
    }
  }, [kinContext, user])
  
  useEffect(() => {
    refreshUsdPrice()
  }, [refreshUsdPrice, user.teacher_profile?.teaching_fee_kin])

  if (!isCurrentUserAvailable() || savingProfileData) return <PageLoader />

  if (currentUserError) {
    console.error(currentUserError)
  }

  return (
    <div>
        <Alert
          show={alert.display}
          onClose={() => setAlert({ ...alert, display: false })}
          variant={alert.variant}
          dismissible
          className="subtitle mb-3 mt-3"
        >
          <span>
            {alert.text}
          </span>
        </Alert>
      <Form>
        <Row sm={12}>
          <span className="subtitle mb-3">Profile Photo</span>
          <Col md={3} className="mb-4">
            <ImageWithPlaceholder
              id="file-input"
              roundedCircle={true}
              image={user.profile_image ? `${process.env.REACT_APP_GOOGLE_CLOUD_PROFILE_IMAGE_BASE_URL}/${user.profile_image}` : ''}
              previewImage={avatar.imagePreview}
              style={{ width: '150px', height: '150px' }}
            />
          </Col>
          <Col md={9}>
            <p>
              This will be displayed to other users when they view your profile.
            </p>

            <Form.Control
              name="image"
              type="file"
              accept=".png,.jpeg,.jpg"
              onChange={handleImagePreview}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <span className="subtitle mb-3 mt-3">Basic Information</span>
          <Form.Group className="mb-3">
            <Form.Label>First name</Form.Label>
            <Form.Control
              name="first_name"
              type="text"
              onChange={handleUserChange}
              defaultValue={user.first_name}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              name="last_name"
              type="text"
              onChange={handleUserChange}
              defaultValue={user.last_name}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>From Country</Form.Label>
            <Form.Select
              name="from_country"
              onChange={handleUserChange}
              value={user.from_country || ''}
            >
            {
              countryCodeLookup()
              .map(({ code, country }) =>
                <option
                  value={code}
                  key={code}>{country}</option>)
            }
            </Form.Select>
          </Form.Group>

          <Tabs
            id="profile-tabs"
            activeKey={tab}
            onSelect={(tab: any) => setTab(tab)}
            className="mb-3"
            variant="pills"
          >
            <Tab eventKey="student" title="Student Profile">
              <Form.Group className="mb-3">
                <Form.Label>Student Intro</Form.Label>
                <Form.Control
                  name="student_profile.introduction"
                  as="textarea"
                  rows={5}
                  onChange={handleUserChange}
                  defaultValue={
                    _.has(user, 'student_profile.introduction')
                      ? user.student_profile?.introduction
                      : ''
                  }
                />
              </Form.Group>
            </Tab>
            <Tab eventKey="teacher" title="Teacher Profile">
              <Form.Group className="mb-3">
                <Form.Label>Teacher Intro</Form.Label>
                <Form.Control
                  name="teacher_profile.introduction"
                  as="textarea"
                  rows={5}
                  onChange={handleUserChange}
                  defaultValue={
                    _.has(user, 'teacher_profile.introduction')
                      ? user.teacher_profile?.introduction
                      : ''
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Introduction Video URL</Form.Label>
                <Form.Control
                  name="teacher_profile.video_url"
                  type="text"
                  placeholder="https://"
                  onChange={handleUserChange}
                  defaultValue={
                    _.has(user, 'teacher_profile.video_url')
                      ? user.teacher_profile?.video_url
                      : ''
                  }
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Teaching fee</Form.Label>

                <InputGroup className="mb-3">
                  <InputGroup.Text>KIN</InputGroup.Text>
                  <Form.Control
                    name="teacher_profile.teaching_fee_kin"
                    type="text"
                    placeholder=""
                    onChange={handleUserChange}
                    defaultValue={
                      _.has(user, 'teacher_profile.teaching_fee_kin')
                        ? user.teacher_profile?.teaching_fee_kin
                        : ''
                    }
                  />
                </InputGroup>
                
                <InputGroup className="mb-3">
                  <InputGroup.Text>USD $</InputGroup.Text>
                  <Form.Control
                    name="teacher_profile.teaching_fee_usd"
                    type="text"
                    placeholder=""
                    disabled={true}
                    value={teachingFeeUsd}
                  />
                </InputGroup>
              </Form.Group>
            </Tab>
          </Tabs>

          <Col sm={12}>
            <Button variant="primary" onClick={handleSave} style={{ width: '100%' }}>
              <FontAwesomeIcon icon="save" style={{ marginRight: '0.5rem' }} />
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Profile
