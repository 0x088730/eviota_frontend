import React, { useState, useEffect } from 'react'
import Wrapper from '../wrapper'
import {
  ModalImage,
  DivContainer,
  AlertContainer,
  ModalContentContainer,
} from './styled'

interface Props {
  keyVal: string
}

const ModalBodySection: React.FC<Props> = (props: any) => {
  const [Status, setStatus] = useState(false)
  useEffect(() => {
    if (props.keyVal === 'failed') {
      setStatus(false)
    } else if (props.keyVal === 'saved') {
      setStatus(true)
    }
  }, [props.keyVal])

  return (
    <Wrapper>
      <DivContainer>
        <ModalImage
          src={`./images/ModalIcons/${
            Status ? 'accept-icon.svg' : 'incorrect.svg'
          }`}
        />
      </DivContainer>
      <AlertContainer>{Status ? 'Saved!' : 'Failed!'}</AlertContainer>
      <ModalContentContainer>
        {Status
          ? 'Your Details have been Saved Successfully'
          : 'Please put something content in Fields.'}
      </ModalContentContainer>
    </Wrapper>
  )
}

export default ModalBodySection
