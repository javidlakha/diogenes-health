import React, { useContext } from "react"
import { ApolloProvider } from "@apollo/client"

import { UserContext, UserContextType } from "contexts/User/User.context"
import { get_client } from "./API.functions"

interface APIProviderProps {
  children: React.ReactNode
}

export function APIProvider({ children }: APIProviderProps) {
  const { get_tokens } = useContext(UserContext) as UserContextType
  const client = get_client(get_tokens)

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
