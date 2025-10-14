import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const HASURA_GRAPHQL_URL = import.meta.env.VITE_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = import.meta.env.VITE_HASURA_ADMIN_SECRET;

console.log("🔗 Hasura URL:", HASURA_GRAPHQL_URL);
console.log("🔐 Admin Secret:", HASURA_ADMIN_SECRET ? "Present ✅" : "Missing ❌");


export const createApolloClient = (token?: string | null) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: HASURA_GRAPHQL_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
      },
    }),
    cache: new InMemoryCache(),
  });
};
