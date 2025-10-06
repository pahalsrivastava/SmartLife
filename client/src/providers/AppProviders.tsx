import { useMemo, type ReactNode } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

function ApolloProviderWithAuth({ children }: { children: ReactNode }) {
  const { getAccessTokenSilently } = useAuth0();

  const httpLink = useMemo(
    () =>
      createHttpLink({
        uri: import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT as string,
      }),
    []
  );

  const authLink = useMemo(
    () =>
      setContext(async (_, { headers }) => {
        try {
          const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;
          const token = await getAccessTokenSilently(
            audience ? { authorizationParams: { audience } } : undefined
          );
          if (token) {
            return {
              headers: {
                ...headers,
                Authorization: `Bearer ${token}`,
              },
            };
          }
        } catch {
          // No token; continue without auth header
        }
        return { headers };
      }),
    [getAccessTokenSilently]
  );

  const client = useMemo(
    () =>
      new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      }),
    [authLink, httpLink]
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;

  if (!domain || !clientId) {
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        ...(audience ? { audience } : {}),
      }}
      cacheLocation="localstorage"
    >
      <ApolloProviderWithAuth>{children}</ApolloProviderWithAuth>
    </Auth0Provider>
  );
}
