import React, { useEffect } from "react"
import { connect } from "react-redux"
import { logoutUser, setIsRoomHost, setRoomTitle } from "../store/actions"
import JoinRoomTitle from "./JoinRoomTitle"
import JoinRoomContent from "./JoinRoomContent"
import github from "../resources/images/GitHub.png"
import gdpr from "../resources/images/GDPR.png"
import logo from "../resources/images/logo.png"

import "./JoinRoomPage.css"
import { Navbar } from "../IntroductionPage/Navbar"

const CreateMeetingPage = (props) => {
  const { setIsRoomHostAction, isRoomHost, currentLoggedInUser, logoutUserAction } = props

  useEffect(() => {
    // In this page we're joining as a host
    setIsRoomHostAction(true)
  }, [])

  return (
    <div className='join_room_page_container'>
      <Navbar logoutUserAction={logoutUserAction} currentLoggedInUser={currentLoggedInUser} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className='join_room_page_panel'>
          <JoinRoomTitle isRoomHost={isRoomHost} />
          <JoinRoomContent />
        </div>
      </div>
    </div>
  )
}

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    setIsRoomHostAction: (isRoomHost) => dispatch(setIsRoomHost(isRoomHost)),
    logoutUserAction: () => dispatch(logoutUser()),
  }
}

export default connect(mapStoreStateToProps, mapActionsToProps)(CreateMeetingPage)
