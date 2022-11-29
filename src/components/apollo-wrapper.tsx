import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  createHttpLink,
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'
import { PageLoader } from './'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

export const ApolloWrapper = ({ children }: any): JSX.Element => {
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0()
  const [bearerToken, setBearerToken] = useState('')

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_HTTP_URL || '',
    fetchOptions: {
      credentials: 'same-origin',
    },
  })

  const wsLink = new GraphQLWsLink(createClient({
    url: process.env.REACT_APP_GRAPHQL_WS_URL || '',
    connectionParams: {
      headers: {
        Authorization: bearerToken ? `Bearer ${bearerToken}` : '',
      },
    },
    lazy: true,
  }))

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  useEffect(() => {
    const getToken = async () => {
      const token = isAuthenticated
        ? await getAccessTokenSilently()
        : ''
      setBearerToken(token)
    }
    // FIXME: This is async, so graphql requests can still occur and produce auth errors.
    getToken()
  }, [getAccessTokenSilently, isAuthenticated, isLoading])

  const authLink = setContext((_, { headers, ...rest }) => {
    process.env.NODE_ENV === 'development' && console.info({ bearerToken })
    return !bearerToken
      ? { headers, ...rest }
      : {
          headers: {
            ...headers,
            role: 'user',
            Authorization: bearerToken ? `Bearer ${bearerToken}` : '',
          },
        }
  })

  const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache(),
  })

  return (
    <ApolloProvider client={client}>
      {isLoading ? (
        <PageLoader />
      ) : bearerToken || !isAuthenticated ? (
        children
      ) : (
        <PageLoader />
      )}
    </ApolloProvider>
  )
}
