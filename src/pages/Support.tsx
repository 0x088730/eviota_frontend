import React, { useEffect } from 'react'
import { useMixpanel } from 'react-mixpanel-browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'

const Support = () => {
  const mixpanel = useMixpanel()

  useEffect(() => mixpanel.track('Loaded support'), [mixpanel])

  return (
    <>
      <p>If you need help with anything, please send us a support request.</p>
      <Button
        onClick={() => {
          window.open('https://forms.gle/XBGhRJg33kFTdeF27')
        }}
      >
        <FontAwesomeIcon icon="file-lines" /> Support Request Form
      </Button>

      <p className="mt-3">You can also get direct support via our Discord server.</p>

      <Button
        onClick={() => {
          window.open('https://discord.gg/Wss64WZQde')
        }}
      >
        <FontAwesomeIcon icon={['fab', 'discord']} /> Join Eviota Discord
      </Button>
    </>
  )
}

export default Support
