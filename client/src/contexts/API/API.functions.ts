import {
  ApolloClient,
  ApolloLink,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { CognitoUserSession } from "amazon-cognito-identity-js"

const API_KEY = process.env.REACT_APP_GRAPHQL_API_KEY
const API_URL = process.env.REACT_APP_GRAPHQL_API_URL

export function get_client(get_tokens: () => Promise<CognitoUserSession>) {
  const http_link = new HttpLink({ uri: API_URL })

  const authLink = setContext((_, { headers }) => {
    return get_tokens()
      .then((session) => {
        const access_token = session.getAccessToken().getJwtToken()

        return {
          headers: {
            Authorization: `${access_token}`,
            ...headers,
          },
        }
      })
      .catch((error) => {
        return {
          headers: {
            "X-Api-Key": API_KEY,
            ...headers,
          },
        }
      })
  })

  const link = ApolloLink.from([authLink, http_link])

  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  }

  return new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions,
    link,
  })
}
