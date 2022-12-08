import React from "react"
import { useNavigate } from "react-router-dom"

const Button = ({ buttonText, cancelButton = false, onClickHandler }) => {
  const buttonClass = cancelButton
    ? "text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2"
    : "text-white bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"

  return (
    <a href='#'>
      <button onClick={onClickHandler} className={buttonClass}>
        {buttonText}
      </button>
    </a>
  )
}

const JoinRoomButtons = ({ handleJoinRoom, isRoomHost }) => {
  const successButtonText = isRoomHost ? "Host" : "Join"

  const history = useNavigate()

  const pushToIntroductionPage = () => {
    history("/")
  }

  return (
    <div className='w-full pr-5 flex justify-end'>
      <Button buttonText={successButtonText} onClickHandler={handleJoinRoom} />

      <Button
        buttonText='Cancel'
        cancelButton
        onClickHandler={pushToIntroductionPage}
      />
    </div>
  )
}

export default JoinRoomButtons
