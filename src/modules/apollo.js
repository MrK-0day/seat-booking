import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { setContext } from 'apollo-link-context'

const httpLink = new HttpLink({
  uri: 'http://qc2:8002/graphql'
})

const wsLink = new WebSocketLink({
  uri: `ws://qc2:8002/graphql`,
  options: {
    reconnect: true
  }
})

const authLink = setContext((_, { headers }) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiX2lkIjoiNWI5MGE4NDM0NTEyNGQ1YTNmMTIyYmFkIiwidXNlcm5hbWUiOiJ0dWFuIiwicGFzc3dvcmQiOiJBNjY1QTQ1OTIwNDIyRjlENDE3RTQ4NjdFRkRDNEZCOEEwNEExRjNGRkYxRkEwN0U5OThFODZGN0Y3QTI3QUUzIiwiaXNFbmFibGVkIjp0cnVlLCJfX3YiOjB9LCJpYXQiOjE1MzYyODkxMDl9.Z3wCutXA9lDtEWXj7wsUvNRHDXfl5q-hzqmZcOPwMsQ'
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

export const Client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
})
