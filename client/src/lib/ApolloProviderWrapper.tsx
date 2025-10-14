import React, { useState, useEffect } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { useAuth } from "@clerk/clerk-react";
import { createApolloClient } from "./apolloClient";

const ApolloProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, getToken } = useAuth();
  const [client, setClient] = useState<ReturnType<typeof createApolloClient> | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    getToken({ template: "hasura" }).then((t) => setClient(createApolloClient(t ?? null)));
  }, [isLoaded, getToken]);

  if (!client) return null;
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
