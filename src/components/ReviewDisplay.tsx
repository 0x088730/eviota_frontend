import React from 'react'
import { format } from 'timeago.js'
import { Row, Col} from 'react-bootstrap'
import { Rating, ImageWithPlaceholder } from './'

const ReviewDisplay = (props) => {

  return (
    <>
      <Row>
        <Col md={2}>
            <ImageWithPlaceholder
              id="file-input"
              roundedCircle={true}
              fluid
              image={props.reviewerProfileImage ? `${process.env.REACT_APP_GOOGLE_CLOUD_PROFILE_IMAGE_BASE_URL}/${props.reviewerProfileImage}` : ''}
              style={{ height: '100px', width: '100px' }}
            />
        </Col>
        <Col md={10}>
          <div style={{ marginBottom: '0rem' }}>
            <h6 style={{ display: 'inline' }}>
              {props.reviewerFirstName} {props.reviewerLastName}
            </h6>
            <span style={{ display: 'inline', float: 'right' }}>
              {format(props.timestamp)}
            </span>
          </div>
          <Rating rating={props.rating} />
          <div className="mt-2">{props.review}</div>
        </Col>
      </Row>
    </>
  )
}

export default ReviewDisplay
