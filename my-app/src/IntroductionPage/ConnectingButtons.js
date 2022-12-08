import React from "react"
import ConnectingButton from "./ConnectingButton"
import { Link, useNavigate } from "react-router-dom"

const ConnectingButtons = ({ isUserLoggedIn }) => {
  let history = useNavigate()

  const pushToJoinRoomPage = () => {
    history("/join-meeting")
  }

  const pushToJoinRoomPageAsHost = () => {
    history("/create-meeting")
  }

  return (
    <div className='flex flex-col w-full max-w-[400px]'>
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
      <Link to='/dash' className="w-full">
        <button
          className="text-white w-full bg-blue-800 hover:bg-blue-900  focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium disabled:cursor-not-allowed rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
          disabled={!isUserLoggedIn}
        >Dashboard</button>
      </Link>
    </div>
  )
}

export default ConnectingButtons
