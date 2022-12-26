import './App.css';
import {useEffect, useState} from "react";
import axios from 'axios';

import front from './1.png';
import open1 from './2.png';
import back from './back.png';


function App() {
    // AUTHORIZE
  const CLIENT_ID = "2cd8d0c061d248bebb78de8840d62b4e"
  const REDIRECT_URI = "http://localhost:3001"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const scopes = [
    "user-top-read"
  ]
  const RESPONSE_TYPE = "token"
  const [token, setToken] = useState("")
  //

  // VARS
  const [artists, setTopArtists] = useState([])
  const [tracks, setTopTracks] = useState([])
  const [user, setUser] = useState("")
  //

  // OBTAINING ACCESS TOKEN
  useEffect( () => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])
  //

  // logout function
  const logout = () => {
     setToken("")
     window.localStorage.removeItem("token")
   }
   //


  // obtain top tracks function
  const topTracks = async (e) => {
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {

    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      limit: 10,
      time_range: "long_term"
    }

  })
  setTopTracks(data.items)
  }
  //

  // obtain top artists function
  const topArtists = async (e) => {
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {

      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 10,
        time_range: "long_term"
      }

    })
    setTopArtists(data.items)
  }
  //

  //obtain username
  const getUser = async (e) => {
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setUser(data.display_name)
  }
  //

  // displays artists
  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id}>
        <span>{artist.name} </span>
      </div>
    ))
  }
  //

  // displays tracks
  const renderTracks = () => {
    let count = 1;
    return tracks.map(track => (
      <div key={track.id}>
        {count++}. {track.name}
      </div>
    ))
  }
  //

  // display username
  const renderUser = () => {
    return user
  }
  //

  // calls all three functions
  const allTime = () => {
    topArtists();
    topTracks();
    getUser();
  }
  //


  return (
    <div className="App">
      <header className="App-header">
        <h1 className='title'>burn your own cd</h1>


        <div className='logout'>
        {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes.join("%20")}&response_type=${RESPONSE_TYPE}`}> Login to Spotify </a>
                
        : <button className="button" onClick={logout}>Logout</button>
        }
        </div>


        {token ?
          <form onSubmit={allTime}>
            <button className="button" type="submit">Start</button>
          </form>
      
        : <h2>log in to begin</h2>
        }

        <div className='front' style={{ backgroundImage: `url(${front})`, backgroundRepeat:"no-repeat", backgroundSize:"contain", height:450, width:750}}>
            <div className='nameMoveF'>
              <p>{renderUser()}'s mixtape</p>
            </div>   
            
                 
        </div>


        <div style={{ backgroundImage: `url(${open1})`, backgroundRepeat:"no-repeat", backgroundSize:"contain", height:450, width:750}}>

          <div className='artistMove'>
          <p><u><b>Top Artists</b></u></p>
          {renderArtists()}
          </div>
          </div>


          <div style={{ backgroundImage: `url(${back})`, backgroundRepeat:"no-repeat", backgroundSize:"contain", height:450, width:750}}>
            <div className='tracksMove'>
              <p><u><b>TrackList</b></u></p>
              {renderTracks()}
            </div>
          </div>


      </header>

      <footer>
        <p>@ https://github.com/hebibi19</p>
      </footer>
    </div>
  );
}

export default App;
