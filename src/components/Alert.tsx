import React from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap'

interface AlertProps {
  error: Error | undefined
}

const Alert = ({ error }: AlertProps) => {
  if (!error) {
    return null;
  }

  return (
    <BootstrapAlert variant="danger" title="Error">
      <BootstrapAlert.Heading>Error</BootstrapAlert.Heading>
      <p className="mb-0">{error instanceof Error ? error.message : JSON.stringify(error, null, 2)}</p>
    </BootstrapAlert>
  )
}

export default Alert;