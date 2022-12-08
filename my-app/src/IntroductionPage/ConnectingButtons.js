import React from "react"
import ConnectingButton from "./ConnectingButton"
import { useNavigate } from "react-router-dom"

const ConnectingButtons = ({ isUserLoggedIn }) => {
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
        onClickHandler={() => isUserLoggedIn ? pushToJoinRoomPageAsHost() : alert('Please login to continue')}
      />
      <ConnectingButton
        buttonText='Join a meeting'
        disabled={!isUserLoggedIn}
        onClickHandler={pushToJoinRoomPage}
      />

      <button
        className="text-white bg-blue-800 hover:bg-blue-900  focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium disabled:cursor-not-allowed rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
        disabled={!isUserLoggedIn}
        onClickHandler={() => console.log('dashboard button clicked')}
      >Dashboard</button>
    </div>
  )
}

export default ConnectingButtons
