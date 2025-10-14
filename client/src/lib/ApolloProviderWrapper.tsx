import React, { useMemo } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { useAuth } from "@clerk/clerk-react";
import { createApolloClient } from "./apolloClient";

const ApolloProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, getToken } = useAuth();
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isLoaded) {
      getToken({ template: "hasura" }).then((t) => setToken(t));
    }
  }, [isLoaded, getToken]);

  const client = useMemo(() => (token ? createApolloClient(token) : createApolloClient(null)), [token]);

  if (!client) return null;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
