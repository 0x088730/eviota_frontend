import React, { useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Button, Container, Form, Alert, Row, Col } from 'react-bootstrap';
import { useMixpanel } from 'react-mixpanel-browser'

const ContactUs = () => {
  const [state, handleSubmit] = useForm("mqknkjdg");
  const mixpanel = useMixpanel()
  
  useEffect(() => mixpanel.track('Loaded Contact Us page'), [mixpanel])

  if (state.succeeded) {
    return (
      <div style={{ marginTop: '150px' }}>
        <Alert key={1} variant="primary">Thank you for contacting us. We'll get back to you shortly.</Alert>
      </div>
    );
  }

  return (
    <Container style={{ marginTop: '150px' }}>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col}>
              <Form.Label>First Name</Form.Label>
              <Form.Control name="firstName" placeholder="First name" required={true} />
              <ValidationError prefix="First Name" field="firstName" errors={state.errors}></ValidationError>
          </Form.Group>
          <Form.Group as={Col}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control name="lastName" placeholder="Last name" required={true} />
              <ValidationError prefix="Last Name" field="lastName" errors={state.errors}></ValidationError>
          </Form.Group>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Email" required={true} />
          <ValidationError prefix="Email" field="email" errors={state.errors}></ValidationError>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control type="textarea" name="message" placeholder="Enter your message here" required={true} />
        </Form.Group>
        <ValidationError prefix="Message" field="message" errors={state.errors}></ValidationError>
        <Button
          type="submit"
          disabled={state.submitting}
        >Submit</Button>
      </Form>
    </Container>
  );
}

export default ContactUs;
