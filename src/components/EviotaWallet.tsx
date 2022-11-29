import { useState } from 'react'
import {
  Spinner,
  Alert,
  Modal,
  Button,
  Form,
  Tabs,
  Tab,
  Image,
} from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useKinWallet } from '../hooks/kin'
import { USER_PRIVATE_SAVE } from '../graphql'
import { useCurrentUser } from '../hooks'
import { PageLoader, KinBalance, KinPayment } from '.'

function EviotaWallet() {
  const {
    wallet,
    importWallet,
    balance,
    createWallet,
    createAccountState,
    refreshBalance,
  } = useKinWallet()
  const {
    currentUser,
    isCurrentUserAvailable,
    error: currentUserError,
  } = useCurrentUser()
  const [importWalletJSON, setImportWalletJSON] = useState<string>('')
  const [isImportMode, setIsImportMode] = useState<boolean>(false)
  const [isImporting, setIsImporting] = useState<boolean>(false)
  const [isWalletCreateError, setIsWalletCreateError] = useState<boolean>(false)
  const [isSecretHidden, setIsSecretHidden] = useState<boolean>(true)
  const [isWalletCopied, setIsWalletCopied] = useState<boolean>(false)
  const [tab, setTab] = useState('add-funds')

  const [withdrawTransactionId, setWithdrawTransactionId] = useState<
    string | undefined
  >(undefined)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [solanaPublicKey, setSolanaPublicKey] = useState('')
  const [showWithdrawPaymentModal, setShowWithdrawPaymentModal] =
    useState(false)

  // Use this mutation to save public key to profile
  const [saveProfile, { loading: isSavingProfileData }] =
    useMutation(USER_PRIVATE_SAVE)

  const handleToggleSecret = () => {
    setIsSecretHidden(!isSecretHidden)
  }

  const handleCreateWallet = () => {
    setIsWalletCreateError(false)
    createWallet(
      async (publicKey: string) => {
        if (!publicKey) {
          throw Error('publicKey not set.')
        }

        await saveProfile({
          variables: {
            userId: currentUser.user_id,
            payload: {
              wallet_public_key: publicKey,
            },
          },
        })
      },
      (error) => {
        console.error(error)
        setIsWalletCreateError(true)
      }
    )
  }

  const importExistingWalletHandler = async () => {
    try {
      setIsWalletCreateError(false)
      setIsImporting(true)

      await importWallet(importWalletJSON)

      const { publicKey } = JSON.parse(importWalletJSON)

      await saveProfile({
        variables: {
          userId: currentUser.user_id,
          payload: {
            wallet_public_key: publicKey,
          },
        },
      })

      // FIXME: Hack for https://app.shortcut.com/pegleg/story/611/import-withdraw-bug
      window.location.reload()
    } catch (error) {
      throw new Error(error as string)
    } finally {
      setIsImportMode(false)
      setIsImporting(false)
    }
  }

  if (currentUserError) {
    console.error(currentUserError)
  }

  if (!isCurrentUserAvailable) {
    return <PageLoader />
  }

  return (
    <div>
      <KinPayment
        amount={withdrawAmount}
        to={solanaPublicKey}
        modalTitle="Withdraw"
        showModal={showWithdrawPaymentModal}
        foreignKey={0}
        onClose={() => setShowWithdrawPaymentModal(false)}
        onPaymentInitiated={(txid) => {
          setWithdrawTransactionId(txid)
          setShowWithdrawPaymentModal(false)
          refreshBalance()
        }}
        resetOnInitiatePayment={true}
        confirmContent={
          <span>
            Pay{' '}
            <Image
              style={{ height: '1em', width: '1em', margin: '0 0.2em 0 0' }}
              className="align-middle"
              src={`${process.env.REACT_APP_KIN_LOGO_WHITE_URL}`}
            />
            {withdrawAmount}{' '}
          </span>
        }
        content={
          <span>
            <p>Are you sure you wish to withdraw the following amount?</p>
            <KinBalance balance={withdrawAmount} displayUsdPrice={true} />
          </span>
        }
      />

      {/* Withdraw initiated modal */}
      <Modal
        show={!!withdrawTransactionId}
        centered
        onHide={() => {
          setWithdrawTransactionId(undefined)
        }}
      >
        <Modal.Header>
          <Modal.Title>Withdraw Initiated</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            Initiated withdraw to the following wallet:
          </div>
          <div className="mb-3">{solanaPublicKey}</div>
          <Modal.Footer>
            <Button
              onClick={() => {
                setWithdrawTransactionId(undefined)
              }}
              variant="secondary"
            >
              <FontAwesomeIcon icon="circle-xmark" /> Close
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      {/* Account creation modal */}
      <Modal show={createAccountState === 'pending' || isImporting} centered>
        <Modal.Body>
          <Spinner
            size="sm"
            animation="border"
            role="status"
            style={{ margin: '0 0.5em 0 0' }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          {createAccountState === 'pending'
            ? 'Creating Account (This can take a while ...)'
            : ''}
          {isSavingProfileData
            ? 'Saving wallet'
            : isImporting
            ? 'Importing Wallet'
            : ''}
        </Modal.Body>
      </Modal>

      {wallet ? (
        <Form>
          <div className="subtitle mb-1">Wallet Address</div>
          <a
            href={`https://kinscan.io/address/${wallet.publicKey}`}
            target="_blank" rel="noopener noreferrer">
          {wallet.publicKey}
          </a>

          <div className="subtitle mb-1 mt-3">Balance</div>
          <KinBalance balance={balance} displayUsdPrice={true}/>

          <Tabs
            activeKey={tab}
            onSelect={(t) => setTab(t as string)}
            className="mb-3 mt-3"
          >
            <Tab eventKey="add-funds" title="Add Funds">
              <div style={{ margin: '1em 0 1em 0' }}>
                <a
                  href={`https://buy.ramp.network/?swapAsset=SOLANA_KIN&userAddress=${wallet.publicKey}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  Add funds to wallet
                </a>
              </div>
            </Tab>
            <Tab eventKey="withdraw" title="Withdraw">
              <Form.Group className="mb-3">
                <Form.Label>KIN Amount</Form.Label>
                <Form.Control
                  type="withdrawAmount"
                  placeholder="Withdraw amount in KIN"
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  value={withdrawAmount}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Solana Public Key</Form.Label>
                <Form.Control
                  type="solanaPublicKey"
                  placeholder="Enter your Solana public key"
                  onChange={(e) => setSolanaPublicKey(e.target.value)}
                  value={solanaPublicKey}
                />
              </Form.Group>
              <Button
                disabled={
                  !(
                    solanaPublicKey &&
                    withdrawAmount &&
                    balance &&
                    withdrawAmount <= balance
                  )
                }
                onClick={() => setShowWithdrawPaymentModal(true)}
              >
                Withdraw
              </Button>
            </Tab>

            <Tab eventKey="backup" title="Backup">
              <Alert variant="warning" className="mt-3 mb-3">
                <p>
                  <FontAwesomeIcon icon="exclamation-circle" /> Do not share
                  your wallet secret with anyone.{' '}
                  <i>Eviota will never ask you for your secret.</i>
                </p>
                <p>
                  <FontAwesomeIcon icon="exclamation-circle" /> To avoid losing
                  funds, backup your wallet text below.
                </p>
                <p className="mb-0">
                  We recommend using a password manager, such as{' '}
                  <a href="https://1password.com/">1Password</a>.
                </p>
              </Alert>

              <Button
                style={{ float: 'right' }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(wallet, undefined, 2)
                  )
                  setIsWalletCopied(true)
                }}
              >
                {isWalletCopied ? (
                  <>
                    <FontAwesomeIcon icon="circle-check" /> Copied
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon="copy" /> Copy to clipboard
                  </>
                )}
              </Button>

              <Button onClick={handleToggleSecret}>
                {' '}
                {isSecretHidden ? (
                  <>
                    <FontAwesomeIcon icon="eye" /> Show secret
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon="eye-slash" /> Hide secret
                  </>
                )}
              </Button>

              <Form.Control
                className="mt-3"
                as="textarea"
                value={
                  isSecretHidden
                    ? [...Array(20)].map((_) => '*').join('')
                    : JSON.stringify(wallet, undefined, 2)
                }
                rows={4}
                readOnly={true}
                style={{ minHeight: 100 }}
              />
            </Tab>
          </Tabs>
        </Form>
      ) : isImportMode ? (
        <Form>
          <FontAwesomeIcon icon="download" />
          Paste your backup wallet below.
          <Form.Control
            as="textarea"
            defaultValue={importWalletJSON}
            onChange={(event: any) => setImportWalletJSON(event.target.value)}
            rows={5}
            style={{ minHeight: 100, margin: '0 0 1em 0' }}
          />
          <Button
            onClick={importExistingWalletHandler}
            style={{ marginRight: '1em' }}
          >
            Import
          </Button>
          <Button variant="secondary" onClick={() => setIsImportMode(false)}>
            Cancel
          </Button>
        </Form>
      ) : (
        <>
          {isWalletCreateError && (
            <Alert variant="danger" className="mb-3">
              <Alert.Heading>Create wallet failed</Alert.Heading>
              <p className="mt-3">
                Sometimes the network has issues. Sorry about that :-(
              </p>
              <p className="mt-3">Feel free to try again.</p>
            </Alert>
          )}
          <p>No Eviota Wallet detected.</p>
          <Button onClick={handleCreateWallet}>Create a New Wallet</Button>
          <span> OR </span>
          <Button onClick={() => setIsImportMode(true)}>
            Import an Existing Wallet
          </Button>
        </>
      )}
    </div>
  )
}

export default EviotaWallet
