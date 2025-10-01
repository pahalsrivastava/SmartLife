import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
    uri: "http://localhost:8080/v1/graphql",
    headers:{
        "x-hasura-admin-secret": "myadminsecretkey",
    },
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export default client;