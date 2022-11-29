import React from 'react'
import { Spinner } from './'

export const PageLoader = () => {
  return (
    <div className="page-loader">
      <div
        style={{
          textAlign: 'center',
          position: 'fixed',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%)',
        }}
      >
        <Spinner />
      </div>
    </div>
  )
}

export default PageLoader
