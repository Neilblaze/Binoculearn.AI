import React, { useEffect } from "react";
import ChatSection from "./ChatSection/ChatSection";
import ParticipantsSection from "./ParticipantsSection/ParticipantsSection";
import VideoSection from "./VideoSection/VideoSection";
import RoomLabel from "./RoomLabel";
import { connect } from "react-redux";
import * as webRTCHandler from "../utils/webRTCHandler";
import Overlay from "./Overlay";
import { toast } from 'react-toastify'

import "./RoomPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { setGlobalConnectionErrorMessage, setIsRoomHost, setRoomId } from "../store/actions";
import { CREATE_ROOM } from "../utils/api";

const RoomPage = ({
  roomId,
  roomTitle,
  isRoomHost,
  showOverlay,
  connectOnlyWithAudio,
  setRoomIdAction,
  globalConnectionErrorMessage,
  setGlobalConnectionErrorMessageAction
}) => {
  const { room_id: roomIdFromParams } = useParams()

  useEffect(() => {
    setGlobalConnectionErrorMessage("") // performing a reset

    if (!roomId && !roomIdFromParams && !isRoomHost) {
      toast.error('Invalid attempt...')
      toast.info('Redirecting back to home screen...', {
        onClose: () => {
          window.location.href = window.location.origin;
        }
      })
    } else if (isRoomHost && !roomIdFromParams) {
      // create room
      // fetch(CREATE_ROOM, {
      //   body: JSON.stringify({
      //     roomTitle,
      //     connectOnlyWithAudio,
      //     jwtToken: localStorage.getItem(process.env.REACT_APP_TOKEN_COOKIE_KEY) ?? ""
      //   })
      // })
      //   .then(e => e.json())
      //   .then(f => {
      //     if (f.error) throw f.message;
      //     window.location.href = `/room/${f.roomId}`
      //   }).catch(err => {
      //     toast(err.message)
      //   })

    } else {
      setRoomIdAction(roomIdFromParams)
      console.log('calling 1...', roomId, roomIdFromParams)
      webRTCHandler.getLocalPreviewAndInitRoomConnection(
        isRoomHost,
        roomTitle,
        roomId ? roomId : roomIdFromParams,
        connectOnlyWithAudio
      );
      // if there is a "conn-error" event then show that error message;;;; DONE; 
    }
    // don't add roomId in dependency list

    return () => {
      // need it. :)
      window.location.reload()
    }
  }, [roomIdFromParams]);


  useEffect(() => {
    if (globalConnectionErrorMessage) {
      toast.error(globalConnectionErrorMessage)
      toast.info('Redirecting back to home screen...', {
        onClose: () => {
          // don't use navigate here.
          // TODO: Uncomment
          // window.location.href='/'
        }
      })
    }
  }, [globalConnectionErrorMessage])

  return (
    <div className="flex h-screen">
      <ParticipantsSection />
      <VideoSection />
      <ChatSection />
      <RoomLabel roomId={roomId} />
      {showOverlay && <Overlay />}
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};


const mapActionsToProps = (dispatch) => {
  return {
    setRoomIdAction: (isRoomHost) => dispatch(setRoomId(isRoomHost)),
    setGlobalConnectionErrorMessageAction: (errorMessage) => dispatch(setGlobalConnectionErrorMessage(errorMessage)),
  }
}


export default connect(mapStoreStateToProps, mapActionsToProps)(RoomPage);
