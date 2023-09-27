import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery, gql, useMutation } from "@apollo/client"

const query = gql`
  query getAllGames {
    games {
      id
      title
      platform
    }
  }
`

const mutation = gql`
  mutation AddGame($game: AddGameInput!){
    addGame(game: $game) {
      id
      title
      platform
    }
  }
`

function App() {

  const {
    // data, 
    // loading, 
    refetch: fetchQueryAgain
  } = useQuery(query);
  const [
    addGame,
    { data, loading, error }  // This is the mutation method
  ] = useMutation(mutation);
  const [result, setResult] = useState([]);
  const [gameTitle, setGameTitle] = useState("");
  const [gamePlatforms, setGamePlatforms] = useState("")

  if (loading) {
    return <h1>Loading ...</h1>
  }

  const getData = async () => {
    const result = (await fetchQueryAgain?.()).data;
    const games = result.games;
    setResult(games);
  }

  const mutateData = () => {
    console.log("Game Title : ", gameTitle);
    console.log("Game Platforms : ", gamePlatforms);

    const platforms = gamePlatforms.split(",");
    console.log("Game Platforms Array, Splitted : ", platforms);

    // We remember that AddGameInput! typeDef contained ...
    // {
    //   title: String!,  ---> This is a String Input
    //   platform: [String!]  ---> This is an Array of Strings
    // }

    // Therefore we defiend a varibale in the query with name of '$game: AddGameInput!'
    // So we have to do the same below to do GraphQL's Mutation Query..
    addGame({
      variables: {
        game: {  // The Variable '$game'
          "title": gameTitle,   // AddGameInput! TypeDef
          "platform": platforms  // AddGameInput! TypeDef
        }
      }
    })

    // This is for the safety check if incase the inputs are missing, or types dont match in TypeScript!.
    if (!error) {
      console.log("Mutation Query Submitted Successfully !!")
    }
    else {
      alert("Error related to GraphQL")
    }

    setTimeout(() => {
      setGameTitle("");
      setGamePlatforms("")
    }, 2000)
  }

  return (
    <div>
      <h1>Fetch & Mutate Data - Games DB</h1>
      <p style={{marginBottom: "5px"}}>Get All Games</p>
      <button onClick={getData}>Query GraphQL</button>
      <p>{result?.length > 0 && JSON.stringify(result)}</p>
      <br /><br />
      <label>Title</label>
      <br/>
      <input type="text" placeholder='Enter Title' value={gameTitle} onChange={(event) => setGameTitle(event.target.value)} />
      <br />
      <label>Platforms</label>
      <br/>
      <input type="text" placeholder='Platform "," separated' value={gamePlatforms} onChange={(event) => setGamePlatforms(event.target.value)} />
      <br /><br />
      <p style={{marginBottom: "5px"}}>Add New Game</p>
      <button onClick={mutateData}>Mutation GraphQL</button>
    </div>
  )
}

export default App
