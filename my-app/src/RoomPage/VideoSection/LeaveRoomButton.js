import React from "react"
import dialIcon from "../../resources/images/Dial_icon.png"

const LeaveRoomButton = () => {
  const handleRoomDisconnection = () => {
    const siteUrl = window.location.origin
    window.location.href = siteUrl
  }

  return (
    <div className='video_button_container'>
      <button className='video_button_end' onClick={handleRoomDisconnection}>
        <img src={dialIcon} className='mx-auto w-2'></img>
      </button>
    </div>
  )
}

export default LeaveRoomButton
