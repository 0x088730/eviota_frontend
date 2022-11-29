import React from 'react'
import { Image } from 'react-bootstrap'

export const Spinner = () => {
  return (
    <Image
      src="images/logo-colored.png"
      alt=""
      className="spin-loader"
      style={{ height: '100px', width: '100px' }}
    />
  )
}

export default Spinner
