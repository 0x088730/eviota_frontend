/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { useForm } from '@formspree/react'
import { Carousel, Button, Form } from 'react-bootstrap'
import { useMixpanel } from 'react-mixpanel-browser'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pushmenu: any
    }
  }
}

export default function LandingPage() {
  const mixpanel = useMixpanel()
  const navigate = useNavigate()
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const [searchParams] = useSearchParams()

  const [state, handleSubmit] = useForm('mqkndbzn')
  const isPreview = searchParams.get('preview')

  useEffect(() => mixpanel.track('Loaded Landing page'), [mixpanel])

  useEffect(() => {
    if (isAuthenticated) {
      return navigate('dashboard')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
    let tl1 = gsap.timeline();
    tl1.to(".botom > #partners", {
      rotation: 45,
      scrollTrigger: {
        trigger: ".botom",
        scrub: 1,
      },
    });
  },[])

  return (
    <div>
      <section className="banner">
        <Carousel
          className="carousel slide"
          data-bs-ride="carousel"
          wrap={true}
          controls={false}
          touch={true}
        >
          <Carousel.Item className="carousel-item">
            <div className="row">
              <div className="col-md-5">
                <div className="head">
                  <h2>
                    <span>Choose a</span> Teacher
                  </h2>
                  <p>
                    Browse our quality online language teachers. Select your
                    teacher, and pay them directly.
                  </p>
                  {isPreview && (
                    <div className="choose">
                      <ul>
                        <li>
                          <a
                            href="#"
                            className="pur"
                            onClick={() => loginWithRedirect()}
                          >
                            Create FREE Account
                          </a>
                        </li>
                        <li>
                          <a href="#" onClick={() => loginWithRedirect()}>
                            I already have account
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-7 right">
                <div className="banner-pic">
                  <img src="images/banner-slide.png" alt="" />
                </div>
              </div>
            </div>
          </Carousel.Item>
          <div className="carousel-item ">
            <div className="row">
              <div className="col-md-5">
                <div className="head">
                  <h2>
                    <span>Begin Your</span> Lesson
                  </h2>
                  <p>Start a video lesson with your teacher right away.</p>
                  {isPreview && (
                    <div className="choose">
                      <ul>
                        <li>
                          <a href="#" className="pur">
                            Create FREE Account
                          </a>
                        </li>
                        <li>
                          <a href="#">I already have account</a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-7 right">
                <div className="banner-pic">
                  <img src="images/slider-2.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item ">
            <div className="row">
              <div className="col-md-5">
                <div className="head">
                  <h2>
                    <span>Join</span> Eviota
                  </h2>
                  <p>
                    Sign up and provide some basic information. It takes less
                    than a minute!
                  </p>
                  {isPreview && (
                    <div className="choose">
                      <ul>
                        <li>
                          <a href="#" className="pur">
                            Create FREE Account
                          </a>
                        </li>
                        <li>
                          <a href="#">I already have account</a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-7 right">
                <div className="banner-pic">
                  <img src="images/slider-3.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </Carousel>
      </section>

      {/* why */}

      <section className="why">
        <div className="container-fluid">
          <div className="row ">
            <div className="col-md-6">
              <div className="why-pic">
                <img src="images/why1.png" alt="" />
              </div>
            </div>
            <div className="col-md-6 main-top">
              <div className="head">
                <h2>
                  <span>Why</span> Eviota
                </h2>
                <p>
                  Eviota offers advantages over typical language tutoring
                  platforms.
                </p>
              </div>
              <div className="row main">
                <div className="col-md-2">
                  <div className="why-logo">
                    <img src="images/w1.png" alt="" />
                  </div>
                </div>
                <div className="col-md-10">
                  <div className="top">
                    <h3>Pay your teacher directly</h3>
                    <p>
                      We think teachers are awesome, so teachers keep all their
                      earnings - We don't take a cent.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row main">
                <div className="col-md-2">
                  <div className="why-logo">
                    <img src="images/why2.png" alt="" />
                  </div>
                </div>
                <div className="col-md-10">
                  <div className="top">
                    <h3>Online teachers</h3>
                    <p>
                      A quality teacher is waiting for you. Learn a language via
                      Zoom video chat within minutes!
                    </p>
                  </div>
                </div>
              </div>
              <div className="row main">
                <div className="col-md-2">
                  <div className="why-logo">
                    <img src="images/why3.png" alt="" />
                  </div>
                </div>
                <div className="col-md-10">
                  <div className="top">
                    <h3>Paid to learn</h3>
                    <p>
                      Receive rewards for participating in language education.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* entering */}

      <section className="Entering">
        {isPreview ? (
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="head">
                  <div className="enter-logo">
                    <img src="images/enter-logo.png" alt="Join Eviota" />
                  </div>
                  <h2>
                    Enter the world of <span>peer-to-peer</span>,{' '}
                    <span>decentralized</span> learning
                  </h2>
                  <div className="join">
                    <a href="#" onClick={() => loginWithRedirect()}>
                      Join Eviota
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mt-5 mb-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="head">
                <div className="enter-logo">
                  <img src="images/enter-logo.png" alt="Join Eviota" />
                </div>
                <div className="signup-form">
                  {state.succeeded ? (
                    <div>
                      <p>Thank you for signing up!</p>
                      <p>
                        You will be notified when you can access our beta
                        program.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p>Eviota is currently in closed beta.</p>
                      <p>
                        Signup to go on the waitlist and receive <b>FREE</b>{' '}
                        rewards on launch.
                      </p>
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="signup-field mb-3">
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            required={true}
                          />
                        </Form.Group>
                        <Form.Group
                          style={{ maxWidth: '200px' }}
                          className="align-items-center mb-4"
                        >
                          <Form.Check
                            key="teacher-checkbox"
                            name="teacher"
                            id="teacher"
                            type="checkbox"
                            label="I'm a Teacher"
                          />
                          <Form.Check
                            key="student-checkbox"
                            name="student"
                            id="student"
                            type="checkbox"
                            label="I'm a Student"
                            className="mt-2"
                          />
                        </Form.Group>
                        <Button type="submit" disabled={state.submitting}>
                          Submit
                        </Button>
                      </Form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </section>

      {/* partners */}

      <section className="partner">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="head">
                <h2>Our Partners</h2>
                <p>
                  We are committed to working with the best industry partners.
                </p>
                <div className="botom">
                  <img id="partners" src="images/partners.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="head">
                <div className="footer-logo">
                  <img src="images/footer-logo.png" alt="" />
                </div>
                {/* <div className="newsletter">
                  <input type="text" placeholder="E-Mail Address" name="" />
                  <button type="button">
                    <img src="images/arrow.png" alt="" />
                  </button>
                </div> */}
                <div className="page-links">
                  <ul>
                    <li>
                      <a href="#">Home</a>
                    </li>
                    {/* <li>
                      <Link to="about">About</Link>
                    </li> */}
                    <li>
                      <Link to="contact-us">Contact Us</Link>
                    </li>
                  </ul>
                </div>
                <div className="copy">
                  <p>&copy; 2022 EVIOTA. All Rights Reserved</p>
                </div>
                <div className="social-link">
                  <ul>
                    <li>
                      <a
                        href="https://twitter.com/eviota_io"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={['fab', 'twitter']} />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/eviota_lang"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={['fab', 'instagram']} />
                      </a>
                    </li>
                    {/* <li>
                      <a href="#" target="_blank">
                        <i
                          className="fa fa-youtube-play"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
