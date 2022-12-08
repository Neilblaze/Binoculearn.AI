import React, { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import IntroductionPage from "./IntroductionPage/IntroductionPage"
import JoinRoomPage from "./JoinRoomPage/JoinRoomPage"
import RoomPage from "./RoomPage/RoomPage"
import { connectWithSocketIOServer } from "./utils/wss"

import "./App.css"
import { GET_CURRENT_USER } from "./utils/api"
import { connect } from "react-redux"
import { setUserInfo } from "./store/actions"

function App({ setUserInfoAction }) {
  useEffect(() => {
    connectWithSocketIOServer()
    const token = localStorage.getItem(process.env.REACT_APP_TOKEN_COOKIE_KEY) ?? ""
    console.log("Axx", token, process.env.REACT_APP_TOKEN_COOKIE_KEY)
    fetch(GET_CURRENT_USER, {
      headers: {
        'Authorization': token
      }
    }).then(e => e.json()).then(f => {
      console.log('setting', f.user)
      setUserInfoAction(f.user)
    }).catch(f => {
      console.log(f)
    })
  }, [])

  return (
    <Router>
      <Routes>
        <Route exact path='/join-room' element={<JoinRoomPage />} />
        <Route exact path='/room' element={<RoomPage />} />
        <Route exact path='/' element={<IntroductionPage />} />
      </Routes>
    </Router>
  )
}



const mapStoreStateToProps = (state) => {
  return {
    ...state,
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    setUserInfoAction: (user) => dispatch(setUserInfo(user)),
  }
}

export default connect(mapStoreStateToProps, mapActionsToProps)(App)

