import { useState, useEffect, useContext, useCallback } from 'react'
import {
  KinClient,
  Wallet,
  createWallet as createKinWallet,
  Memo,
  TransactionType,
  MAX_VERSION,
} from '@kin-sdk/client'
import { KinContext } from '../lib/kin-client'

const MAX_CREATE_WALLET_RETRIES = 10
const MAX_TRANSACTION_RETRIES = 10

type SolanaAccountState = undefined | 'pending' | 'created' | 'error'

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export const useKinWallet = () => {
  const kinContext = useContext(KinContext) as KinClient
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)
  const [balance, setBalance] = useState<any>()
  const [createAccountState, setCreateAccountState] =
    useState<SolanaAccountState>()
  const [usdPrice, setUsdPrice] = useState<number | undefined>(0)

  const walletName = `${
    process.env.NODE_ENV !== 'production' ? process.env.NODE_ENV : ''
  }wallet`

  const loadWalletFromStorage = useCallback(() => {
    const existingWallet = localStorage.getItem(walletName)
    setWallet(
      existingWallet ? (JSON.parse(existingWallet) as Wallet) : undefined
    )
  }, [walletName])

  const importWallet = useCallback(
    async (walletString: string): Promise<void> => {
      const walletParsed = JSON.parse(walletString)

      if (!walletParsed.publicKey && walletParsed.secret) {
        throw new Error(
          'Malformed wallet. Wallet object must contain publicKey and secret.'
        )
      }

      const isValidAccount = await kinContext.hasTokenAccounts(
        walletParsed.publicKey
      )
      if (!isValidAccount) {
        throw new Error('No token accounts found. Unable to set wallet.')
      }
      setWallet(walletParsed)
      localStorage.setItem(walletName, walletString)
    },
    [walletName, kinContext]
  )

  const createWallet = useCallback(
    async (
      cb?: (publicKey: string) => void,
      errorCb?: (publicKey: string) => void
    ): Promise<void> => {
      let wallet: Wallet
      let [result, error] = Array(2).fill(undefined)

      const attempt = async (attempts) => {
        console.info(`Wallet create attempt ${attempts}`)

        wallet = createKinWallet('create')
        setCreateAccountState('pending')

        try {
          ;[result, error] = await kinContext.createAccount(wallet.secret!)
        } catch (runtimeError) {
          error = runtimeError
        }

        if (error || !wallet.publicKey || !result) {
          console.error(
            'An error occured whilst creating wallet.',
            error ?? 'Public key or result not found.'
          )

          if (attempts < MAX_CREATE_WALLET_RETRIES) {
            return await attempt(++attempts)
          } else {
            error = 'Maximum wallet retry attempts exceeded.'
          }
        } else {
          localStorage.setItem(walletName, JSON.stringify(wallet))
          setCreateAccountState('created')
          setWallet(wallet)
        }
      }

      await attempt(1)

      if (error) {
        setCreateAccountState('error')
        if (errorCb) errorCb('An error occured whilst generating wallet.')
      } else if (wallet! && wallet.publicKey) {
        if (cb) cb(wallet.publicKey)
      }
    },
    [walletName, kinContext]
  )

  const refreshBalance = useCallback(async (): Promise<void> => {
    if (wallet) {
      const accountBalances = await kinContext.getBalances(wallet.publicKey!)

      const balance = accountBalances
        .flat()
        .reduce(
          (prev: any, curr: any) =>
            (prev =
              curr && curr.balance
                ? prev + Number.parseFloat(curr.balance)
                : prev),
          0
        )

      setBalance(parseFloat(balance).toFixed(2))
    }
  }, [kinContext, wallet])

  const refreshUsdPrice = useCallback(async (): Promise<void> => {
    const prices = await kinContext.getPrices()
    if (prices && prices.kin && prices.kin.usd) {
      setUsdPrice(prices.kin.usd)
    }
  }, [kinContext])

  const createPayment = useCallback(
    async ({ amount, destination, foreignKey }): Promise<string> => {
      if (!wallet) {
        throw new Error('Wallet undefined.')
      }

      let memo: Memo | undefined = undefined
      if (foreignKey) {
        const buf = Buffer.allocUnsafe(4)
        buf.writeUInt32LE(foreignKey)
        memo = Memo.new(
          MAX_VERSION,
          TransactionType.Spend,
          Number(process.env.REACT_APP_KIN_APP_INDEX),
          buf
        )
      }

      let [txId, error] = Array(2).fill(undefined)

      const attempt = async (attempts) => {
        console.info(`Transaction submit attempt ${attempts}`)

        try {
          const [result, submitPaymentError] = await kinContext.submitPayment({
            secret: wallet.secret!,
            amount,
            destination,
            tokenAccount: wallet.publicKey!,
            ...(memo ? { memo: memo.buffer.toString('base64') } : []),
          })
          error = submitPaymentError
          txId = result
        } catch (runtimeError) {
          error = runtimeError
          console.error(runtimeError)
        }

        if (error) {
          console.error('An error occured whilst submitting transaction.')

          await sleep(process.env.REACT_APP_TRANSACTION_RETRY_DELAY)

          if (attempts < MAX_TRANSACTION_RETRIES) {
            return await attempt(++attempts)
          } else {
            error = 'Maximum transaction retry attempts exceeded.'
          }
        }
      }

      await attempt(1)

      if (error) {
        console.error(error)
        throw Error(error)
      }

      return txId
    },
    [kinContext, wallet]
  )

  useEffect(() => {
    if (!wallet) {
      loadWalletFromStorage()
    } else {
      refreshBalance()
    }
  }, [loadWalletFromStorage, refreshBalance, wallet])

  return {
    wallet,
    createWallet,
    importWallet,
    balance,
    refreshBalance,
    createAccountState,
    createPayment,
    refreshUsdPrice,
    usdPrice,
  }
}
