import React from "react"
import { connect } from "react-redux"
import { setActiveConversation } from "../../store/actions"
import activeStatus from "../../resources/images/active_status.png"

const SingleParticipant = (props) => {
  const {
    identity,
    lastItem,
    participant,
    setActiveConversationAction,
    socketId,
  } = props

  const handleOpenActiveChatbox = () => {
    if (participant.socketId !== socketId) {
      setActiveConversationAction(participant)
    }
  }

  return (
    <div className="flex flex-col justify-start ml-3">
      <p className='flex text-sm w-fit justify-center gap-1 text-gray-300 items-center' onClick={handleOpenActiveChatbox}>
        <img style={{ width: "10px", height: "10px" }} src={activeStatus}></img> {identity}
      </p>
      {!lastItem && <span className='participants_separator_line'></span>}
    </div>
  )
}

const Participants = ({
  participants,
  setActiveConversationAction,
  socketId,
}) => {
  return (
    <div className='participants_container'>
      {participants.map((participant, index) => {
        return (
          <SingleParticipant
            key={participant.identity}
            lastItem={participants.length === index + 1}
            participant={participant}
            identity={participant.identity}
            setActiveConversationAction={setActiveConversationAction}
            socketId={socketId}
          />
        )
      })}
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
    setActiveConversationAction: (activeConversation) =>
      dispatch(setActiveConversation(activeConversation)),
  }
}

export default connect(mapStoreStateToProps, mapActionsToProps)(Participants)
