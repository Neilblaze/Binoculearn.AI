import React, { useState } from "react";
import JoinRoomInputs from "./JoinRoomInputs";
import { connect } from "react-redux";
import OnlyWithAudioCheckbox from "./OnlyWithAudioCheckbox";
import {
  setConnectOnlyWithAudio,
  setIdentity,
  setRoomId,
  setRoomTitle,
} from "../store/actions";
import ErrorMessage from "./ErrorMessage";
import JoinRoomButtons from "./JoinRoomButtons";
import { useNavigate } from "react-router-dom";
import { CREATE_ROOM, getRoomExists } from "../utils/api";
import { toast } from "react-toastify";
import axios from "axios";

const JoinRoomContent = (props) => {
  const {
    isRoomHost,
    setConnectOnlyWithAudio,
    connectOnlyWithAudio,
    setRoomTitleAction,
    setRoomIdAction,
  } = props;

  const [roomIdValue, setRoomIdValue] = useState("");
  const [roomNameValue, setRoomNameValue] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const history = useNavigate();

  const handleJoinRoom = async () => {
    setRoomTitleAction(roomNameValue);
    if (isRoomHost) {
      createRoom();
    } else {
      await joinRoom();
    }
  };

  const joinRoom = async () => {
    const responseMessage = await getRoomExists(roomIdValue);

    const { roomExists, full } = responseMessage;

    if (roomExists) {
      if (full) {
        setErrorMessage("Meeting is full. Please try again later.");
      } else {
        // join a room !
        setRoomIdAction(roomIdValue);
        history(`/room/${roomIdValue}`);
      }
    } else {
      setErrorMessage("Meeting not found. Check your meeting id.");
    }
  };

  const createRoom = () => {
    axios.post(CREATE_ROOM, {
      roomTitle: roomNameValue,
      connectOnlyWithAudio,
      jwtToken: localStorage.getItem(process.env.REACT_APP_TOKEN_COOKIE_KEY) ?? ""
    })
      .then(f => {
        console.log(f.data)
        if (f.data.error) throw new Error(f.data.message);
        window.location.href = `/room/${f.data.roomId}`
      }).catch(err => {
        toast(err.message)
      })
  };

  return (
    <>
      <JoinRoomInputs
        roomIdValue={roomIdValue}
        setRoomIdValue={setRoomIdValue}
        nameValue={roomNameValue}
        setNameValue={setRoomNameValue}
        isRoomHost={isRoomHost}
      />
      <OnlyWithAudioCheckbox
        setConnectOnlyWithAudio={setConnectOnlyWithAudio}
        connectOnlyWithAudio={connectOnlyWithAudio}
      />
      <JoinRoomButtons
        handleJoinRoom={handleJoinRoom}
        isRoomHost={isRoomHost}
      />
      <ErrorMessage errorMessage={errorMessage} />
    </>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    setConnectOnlyWithAudio: (onlyWithAudio) =>
      dispatch(setConnectOnlyWithAudio(onlyWithAudio)),
    setRoomTitleAction: (roomTitle) => dispatch(setRoomTitle(roomTitle)),
    setRoomIdAction: (roomId) => dispatch(setRoomId(roomId)),
  };
};

export default connect(
  mapStoreStateToProps,
  mapActionsToProps
)(JoinRoomContent);
