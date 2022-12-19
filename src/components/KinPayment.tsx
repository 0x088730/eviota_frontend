import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKinWallet } from '../hooks/kin'
import { Button, Modal, Image, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type KinPaymentProps = {
  amount: string
  to: string
  foreignKey?: number
  showModal: boolean
  content: any
  confirmContent: JSX.Element
  modalTitle: string
  onClose?: () => void
  onPaymentInitiated?: (txId: string) => void
  onError?: (message: string) => void,
  resetOnInitiatePayment?: boolean
}

const KinPayment = ({
  amount,
  to,
  foreignKey,
  showModal,
  content,
  confirmContent,
  modalTitle,
  onClose,
  onPaymentInitiated,
  onError,
  resetOnInitiatePayment
}: KinPaymentProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasWallet, setHasWallet] = useState(false)
  const [isSufficientBalance, setIsSufficientBalance] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { createPayment, balance, wallet } = useKinWallet()

  const resetState = useCallback(() => {
    setErrorMessage('')
    setIsLoading(false)
  }, [])

  const onCancelPayment = useCallback(() => {
    resetState()
    onClose?.()
  }, [onClose, resetState])

  const onInitiatePayment = useCallback(
    async (amount, to, foreignKey) => {
      setErrorMessage('')
      setIsLoading(true)

      console.info(`Sending ${amount} KIN from ${wallet?.publicKey} to ${to}`)

      try {
        const txid = await createPayment({
          amount,
          destination: to,
          foreignKey,
        })

        if (onPaymentInitiated) { 
          onPaymentInitiated(txid)
        }
        
        if (resetOnInitiatePayment) {
          resetState();
        }

      } catch (error) {
        setErrorMessage('An error occured whilst creating payment.')
      }
    },
    [createPayment, wallet, onPaymentInitiated, resetOnInitiatePayment, resetState]
  )

  const navigate = useNavigate()

  useEffect(() => {
    setIsSufficientBalance(parseFloat(balance) >= parseFloat(amount))
  }, [balance, amount])

  useEffect(() => {
    setHasWallet(!!wallet)
  }, [wallet])

  return (
    <Modal show={showModal} onClose={onCancelPayment} centered>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      {(() => {
        switch (true) {
          case !!errorMessage:
            return (
              <Modal.Body>
                <Alert variant="danger">
                  <Alert.Heading>Payment failed</Alert.Heading>
                  <p>{errorMessage}</p>
                  <p><a href="https://docs.eviota.io/#/faq?id=how-can-i-submit-a-support-request">Support FAQ</a></p>
                </Alert>

                <Modal.Footer>
                  <Button onClick={onCancelPayment} variant="secondary">
                    <FontAwesomeIcon icon="circle-xmark" /> Close
                  </Button>
                </Modal.Footer>
              </Modal.Body>
            )

          case !hasWallet:
            return (
              <Modal.Body>
                <p>You do not have a wallet configured.</p>
                <p>
                  <Button onClick={() => navigate('/wallet')}>
                    Set up your wallet
                  </Button>
                </p>
              </Modal.Body>
            )

          case !isSufficientBalance:
            return (
              <Modal.Body>
                <p style={{ lineHeight: '16px' }}>
                  Insufficient balance:{' '}
                  <Image
                    style={{
                      height: '1em',
                      width: '1em',
                      margin: '0 0.2em 2px 0',
                    }}
                    className="align-middle"
                    src={process.env.REACT_APP_KIN_LOGO_URL}
                  />
                  {balance}
                </p>
                <p>
                  Required:{' '}
                  <Image
                    style={{
                      height: '1em',
                      width: '1em',
                      margin: '0 0.2em 2px 0',
                    }}
                    className="align-middle"
                    src={process.env.REACT_APP_KIN_LOGO_URL}
                  />
                  {amount}
                </p>
                <p>
                  <Button onClick={() => navigate('/wallet')}>
                    Top up your wallet
                  </Button>
                </p>
              </Modal.Body>
            )

          default:
            return (
              <>
                <Modal.Body>
                  <p>{content}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={onCancelPayment}
                    variant="secondary"
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon icon="circle-xmark" /> Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      onInitiatePayment(amount, to, foreignKey)
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing ...' : confirmContent}
                  </Button>
                </Modal.Footer>
              </>
            )
        }
      })()}
    </Modal>
  )
}

export default KinPayment
