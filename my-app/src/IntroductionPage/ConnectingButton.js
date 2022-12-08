import React from "react"
import host from "../resources/images/host_meeting.png"
const ConnectingButton = ({
  createRoomButton = false,
  buttonText,
  disabled,
  onClickHandler,
}) => {
  const buttonClass = createRoomButton
    ? "create_room_button"
    : "join_room_button"

  return (
    <button disabled={disabled} className={`${buttonClass} ${buttonClass==='create_room_button'? 'text-white bg-gray-800 hover:bg-gray-900': 'text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300'}  focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium disabled:cursor-not-allowed rounded-lg text-sm px-5 py-2.5 mr-2 mb-2`} onClick={onClickHandler}>
      {buttonText}
    </button>
  )
}

export default ConnectingButton
