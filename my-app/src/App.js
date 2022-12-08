import React, { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import IntroductionPage from "./IntroductionPage/IntroductionPage"
import RoomPage from "./RoomPage/RoomPage"
import { connectWithSocketIOServer } from "./utils/wss"

import "./App.css"
import { GET_CURRENT_USER } from "./utils/api"
import { connect } from "react-redux"
import { setUserInfo } from "./store/actions"
import CreateMeetingPage from "./JoinRoomPage/CreateMeetingPage"
import JoinMeetingPage from "./JoinRoomPage/JoinMeetingPage"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashPage from "./DashPage/DashPage"
import MeetDetailsPage from "./MeetDetailsPage/MeetDetailsPage"


function App({ setUserInfoAction }) {
  useEffect(() => {
    connectWithSocketIOServer()
    const token = localStorage.getItem(process.env.REACT_APP_TOKEN_COOKIE_KEY) ?? ""
    fetch(GET_CURRENT_USER, {
      headers: {
        'Authorization': token
      }
    }).then(e => e.json()).then(f => {
      console.log('setting', f.user)
      setUserInfoAction(f.user)
    }).catch(f => {
      console.error(f)
    })
  }, [])

  return (
    <Router>
      <Routes>
        <Route exact path='/create-meeting' element={<CreateMeetingPage />} />
        <Route exact path='/join-meeting' element={<JoinMeetingPage />} />
        {/* <Route exact path='/room' element={<RoomPage />} /> */}
        <Route path='/room/:room_id' element={<RoomPage />} />
        <Route exact path='/' element={<IntroductionPage />} />
        <Route exact path='/dash' element={<DashPage />} />
        <Route exact path='/transcripts/:meet_id' element={<MeetDetailsPage />} />
      </Routes>
      <ToastContainer autoClose='1000' />
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

