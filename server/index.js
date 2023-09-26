const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4")
const cors = require("cors");

const { typeDefs } = require("../server/graphql/schema");
const { resolvers } = require("../server/graphql/resolvers");

const startServer = async () => {

    const app = express();
    const PORT = process.env.PORT || 8000

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    const gql_server = new ApolloServer({
        // typdefs,
        typeDefs,
        // resolvers,
        resolvers,
    });

    await gql_server.start();  // We need to await the Apollo Server in anycase, else you will get Error.

    app.use("/graphql", expressMiddleware(gql_server));

    app.get("/", (req, res) => {
        res.send("Hello From GraphQL Node Js Server")
    })

    app.listen(PORT, () => (
        console.log(`Server Running on Port ---> ${PORT}`)
    ))
}

startServer();