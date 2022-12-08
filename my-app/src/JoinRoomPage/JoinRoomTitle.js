import React from "react"

const JoinRoomTitle = ({ isRoomHost }) => {
  const titleText = isRoomHost ? "Host a meeting" : "Join a meeting"

  return <p className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-center w-full mt-8 mb-7'>{titleText}</p>
}

export default JoinRoomTitle
