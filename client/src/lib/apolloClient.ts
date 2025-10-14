import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function createApolloClient(token?: string) {
  return new ApolloClient({
    link: new HttpLink({
      uri: import.meta.env.VITE_HASURA_GRAPHQL_URL,
      headers: {
        "x-hasura-admin-secret": import.meta.env.VITE_HASURA_ADMIN_SECRET,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }),
    cache: new InMemoryCache(),
  });
}
