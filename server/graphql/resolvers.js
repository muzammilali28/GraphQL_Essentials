/**
 * ---> Key Notes <---
 * 
 * 1. When you send some parameters/variables to a GraphQL Query, use (_,args), here 'args' contains the query object.
 * 
 * 2. If you have a nested query which returns more than one (key:value) Object of TypeDefs, write them separately
 *    like we have written below for Game{} Review{} Author{} , this will allow us get more result just by running
 *    a single GraphQL from Frontend - Client Side.
 * 
 * 3. The 'parent' parameter in the nested queries (related queries) is actually the object returned back at first
 *    when it hits the main query and uses that result as in input for second nested query to execute.
 *    (
 *      I know its a bit difficult to explain 😅, It'll be better to run this Repository and test for yourself.
 *      You will have a better understanding of it.
 *    )
 * 
 */

const db = require("../test_db_gql");

const resolvers = {
    Query: {
        games() {
            // query getAllGames {
            //     games {
            //       id
            //       title
            //       platform
            //     }
            //   }

            // Logic!
            return db.games
        },
        authors() {
            // query getAllAuthors {
            //     authors {
            //       id
            //       name
            //       verified
            //     }
            //   }

            //Logic!
            return db.authors
        },
        reviews() {
            // query getAllReviews {
            //     reviews {
            //       id
            //       rating
            //       content
            //     }
            //   }

            // Logic!
            return db.reviews
        },

        // Variable Queries, query with specific ID
        game(_, args) {
            // query getGameById($gameId: ID!) {
            //     game(id: $gameId) {
            //       id
            //       title
            //       platform
            //     }
            //   }

            // Logic!
            return db.games.find((game) => game.id === args.id)
        },
        author(_, args) {
            // query getAuthorById($authorId: ID!) {
            //     author(id: $authorId) {
            //      id
            //      name
            //      verified 
            //     }
            //   }

            // Logic!
            return db.authors.find((author) => author.id === args.id)
        },
        review(_, args) {
            // query getReviewById($reviewId: ID!) {
            //     review(id: $reviewId) {
            //       id
            //       content
            //       rating
            //     }
            //   }

            // Logic!
            return db.reviews.find((review) => review.id === args.id)
        }
    },
    Game: {
        // Here the "Parent" is actually the Result of Return Value of reviews()
        // You can say the data received from the Object of Game except the Realted-Query, which is returned by reviews()
        // This same scenario applies to all the below Query Objects / Query TypeDefs Objects respectively.
        reviews(parent) {
            // query getGameNReviews {
            //     games {
            //       id
            //       title
            //       platform
            //       reviews {
            //         id
            //         content
            //         rating
            //       }
            //     }
            //   }

            // Logic!
            return db.reviews.filter((review) => review.game_id === parent.id)
        }
    },
    Review: {
        author(parent) {
            // query getReviewNAuthor {
            //     reviews {
            //       id
            //       content
            //       rating
            //       author {
            //         id
            //         name
            //         verified
            //       }
            //     }
            //   }

            // Logic!
            return db.authors.find((author) => author.id === parent.author_id)
        },
        game(parent) {
            // query getReviewNGame {
            //     reviews {
            //       id
            //       content
            //       rating
            //       game {
            //         id
            //         title
            //         platform
            //       }
            //     }
            //   }

            // Logic!
            return db.games.find((game) => game.id === parent.game_id)
        }

        // Below Query includes both author and game nested inside the query of 'Review'
        // query getReviewNGame {
        //     reviews {
        //       id
        //       content
        //       rating
        //       author {
        //         id
        //         name
        //         verified
        //       }
        //       game {
        //         id
        //         title
        //         platform
        //       }
        //     }
        //   }
    },
    Author: {
        reviews(parent) {
            // query getAuthorNReviews {
            //     authors {
            //       id
            //       name
            //       verified
            //       reviews {
            //         id
            //         content
            //         rating
            //       }
            //     }
            //   }

            // Logic!
            return db.reviews.filter((review) => review.author_id === parent.id)
        }
    },
    Mutation: {
        // Mutation Process - Adding a Game
        // Example Mutation Query via (Apollo Server)
        // See Example (1) Commented Below
        addGame(_, args) {
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 10000).toString()
            }
            db.games.push(game)
            return game
        },
        // Mutation Process - Deleting a Game
        // Example Mutation Query via (Apollo Server)
        // See Example (3) Commented Below
        deleteGame(_, args) {
            db.games = db.games.filter((game) => game.id !== args.id)
            return db.games
        },
        // Mutation Process - Editing / Updating a Game
        // Example Mutation Query via (Apollo Server)
        // See Example (2) Commented Below
        updateGame(_, args) {
            db.games = db.games.map((game) => {
                if (game.id === args.id) {
                    return { ...game, ...args.edits }
                }
                return game
            })
            return db.games.find((game) => game.id === args.id)
        }
    }
}

module.exports = { resolvers };

// Example (1) --> AddGame
//   --->Operation<---
//   mutation AddGame($game: AddGameInput!){
//     addGame(game: $game) {
//       id
//       title
//       platform
//     }
//   }

//   --->Variables<---
//   {
//     "game": {
//       "title": "CSGO",
//       "platform": ["PC","XBOX","PS4"]
//     }
//   }

//   --->Result<---
//   {
//     "data": {
//       "addGame": {
//         "id": "1370",
//         "title": "CSGO",
//         "platform": [
//           "PC",
//           "XBOX",
//           "PS4"
//         ]
//       }
//     }
//   }




// Example (2) --> UpdateGame
//   --->Operation<---
//   mutation UpdateGame ($id: ID!, $edits: EditGameInput){
//     updateGame(id: $id, edits: $edits) {
//       id,
//       title,
//       platform
//     }
//   }

//   --->Variables<---
//   {
//     "id": "1370",
//     "edits": {
//       "title":"CS2",
//       "platform": ["PC"]
//     },
//   }

//   --->Result<---
//   {
//     "data": {
//       "updateGame": {
//         "id": "1370",
//         "title": "CS2",
//         "platform": [
//           "PC"
//         ]
//       }
//     }
//   }



// // Example (3) --> DeleteGame
//   --->Operation<---
//   mutation DeleteGame($id: ID!) {
//     deleteGame(id: $id) {
//       id
//       title
//       platform
//     }
//   }

//   --->Variables<---
//   {
//     "id": "1370"
//   }

//   --->Result<---
//   It will return all the Games except the variable('id') because it has been deleted