/**
 * ---> Key Notes <---
 * 
 * 1. The "!" mark is for (required) property like we do in MongoDB and PostgreSQL using Mongoose and Sequelize accordingly.
 * 2. All these TypesDef defined are like "TypeScript" in JavaScript, which includes (interface, types, input, enum etc.,)
 * 3. Always make a seperate file like this for storing all your Schema's TypeDefs for GraphQL
 * 4. Make sure to write `#graphql ....` before the start of typedefs.
 * 
 */

const typeDefs = `#graphql
    type Game {
    # Default Data Types for 'Game' Object
    id: ID!
    title: String!
    platform: [String!]!

    # Realted Data Relation for Related-Queries
    reviews: [Review!]
  }
  type Review {
    # Default Data Types for 'Review' Object
    id: ID!
    rating: Int!
    content: String!

    # Realted Data Relation for Related-Queries
    author: Author!
    game: Game!
  }
  type Author {
    # Default Data Types for 'Author' Object
    id: ID!
    name: String!
    verified: Boolean!

    # Realted Data Relation for Related-Queries
    reviews: [Review!]
  }

  ### This needs to be defined else GraphQL won't know what to query and on what data.
  type Query {
    # Normal Queries
    games: [Game]
    reviews: [Review]
    authors: [Author]

    # Queries with Variables
    game(id: ID!): Game
    review(id: ID!): Review
    author(id: ID!): Author
  }

  # Input-Typedefs for Mutation Query Variables.
  input AddGameInput {
    title: String!,
    platform: [String!]!
  }
  input EditGameInput {
    title: String,
    platform: [String!]
  }

  ### This part is for Mutation of Data, i.e Data Mutation via GraphQL
  type Mutation {
    deleteGame(id: ID!): [Game]
    addGame(game: AddGameInput!): Game
    updateGame(id: ID!, edits: EditGameInput): Game
  }

`
module.exports = { typeDefs };