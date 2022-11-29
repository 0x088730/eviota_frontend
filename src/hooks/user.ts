import { useState, useEffect, useCallback } from 'react'
import { useSubscription } from '@apollo/client'
import _ from 'lodash'
import { USER_DETAILS_PRIVATE } from '../graphql'

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<any>({})

  const { data, loading, error } = useSubscription(USER_DETAILS_PRIVATE)

  const isCurrentUserAvailable = useCallback(
    () => !_.isEmpty(currentUser),
    [currentUser]
  )

  useEffect(() => {
    if (!data) {
      return
    }
    if (
      data &&
      data.hasOwnProperty('users_private') &&
      data.users_private.length
    ) {
      setCurrentUser(data.users_private[0])
    }
  }, [data])

  return {
    loading,
    currentUser,
    error,
    isCurrentUserAvailable,
  }
}
