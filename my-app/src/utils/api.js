import axios from "axios"

const serverApi = `${process.env.REACT_APP_SERVER_URL}/api`

export const getRoomExists = async (roomId) => {
  const response = await axios.get(`${serverApi}/room-exists/${roomId}`)
  return response.data
}

export const getTURNCredentials = async () => {
  const response = await axios.get(`${serverApi}/get-turn-credentials`)
  return response.data
}

export const GET_SENTIMENT_URL=`${serverApi}/findSentiment`

export const GET_SUMMARY_URL=`${serverApi}/summarize`


export const GET_CURRENT_USER=`${process.env.REACT_APP_SERVER_URL}/api/auth/me`



export const START_GOOGLE_SIGNIN=`${process.env.REACT_APP_SERVER_URL}/api/auth/google/start/`

export const CREATE_ROOM=`${process.env.REACT_APP_SERVER_URL}/api/room/create`


export const BROADCAST_MESSAGE=`${process.env.REACT_APP_SERVER_URL}/api/broadcastMessage`
