import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const createApolloClient = (token: string | null) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: import.meta.env.HASURA_GRAPHQL_URL,
      headers: {
        "x-hasura-admin-secret": import.meta.env.HASURA_ADMIN_SECRET,
        Authorization: token ? `Bearer ${token}` : "",
      },
    }),
    cache: new InMemoryCache(),
  });
};
