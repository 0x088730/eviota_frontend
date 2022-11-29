import React, { useEffect } from 'react'
import { Image } from 'react-bootstrap'
import { useKinWallet } from '../hooks'

function KinBalance({
  balance,
  displayUsdPrice,
}: {
  balance: any
  displayUsdPrice?: boolean
}) {
  const {
    refreshUsdPrice,
    usdPrice
  } = useKinWallet()

  useEffect(() => {
    refreshUsdPrice()
  }, [balance, refreshUsdPrice])

  return (
    <span style={{ margin: '0 0 1em 0' }}>
      <Image
        style={{ height: '1em', width: '1em', margin: '0 0.5em 0 0' }}
        className="align-middle"
        src={process.env.REACT_APP_KIN_LOGO_URL}
      />
      <span className="align-middle">
        <span style={{ marginRight: '0.25em' }}>{balance}</span>

        {balance && displayUsdPrice && usdPrice && (
          <strong> (USD: ${(balance * usdPrice).toFixed(2)})</strong>
        )}
      </span>
    </span>
  )
}

export default KinBalance
