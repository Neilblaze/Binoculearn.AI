import React from "react"
import ConnectingButton from "./ConnectingButton"
import { useNavigate } from "react-router-dom"

const ConnectingButtons = ({isUserLoggedIn}) => {
  let history = useNavigate()

  const pushToJoinRoomPage = () => {
    history("/join-room")
  }

  const pushToJoinRoomPageAsHost = () => {
    history("/join-room?host=true")
  }

  return (
    <div className='connecting_buttons_container'>
      <ConnectingButton
        createRoomButton
        buttonText='Host a meeting'
        disabled={!isUserLoggedIn}
        onClickHandler={() => isUserLoggedIn? pushToJoinRoomPageAsHost(): alert('Please login to continue')}
      />
      <ConnectingButton
        buttonText='Join a meeting'
        disabled={!isUserLoggedIn}
        onClickHandler={pushToJoinRoomPage}
      />
    </div>
  )
}

export default ConnectingButtons
