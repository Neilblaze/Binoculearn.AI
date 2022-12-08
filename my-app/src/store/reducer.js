import Actions from "./actions";

const initState = {
  identity: "",
  roomTitle: '', // to be used while creating a new room
  isRoomHost: false,
  connectOnlyWithAudio: false,
  roomId: null,
  showOverlay: true,
  participants: [],
  messages: [],
  activeConversation: null,
  directChatHistory: [],
  socketId: null,
  currentLoggedInUser: null,
  globalConnectionErrorMessage: ""
};

const reducer = (state = initState, action) => {
  // console.log('tmp',action.currentLoggedInUser)
  switch (action.type) {
    case Actions.SET_ROOM_TITLE:
      return {
        ...state,
        roomTitle: action.roomTitle
      }
    case Actions.SET_GLOBAL_CONNECTION_ERROR_MESSAGE:
      return {
        ...state,
        globalConnectionErrorMessage: action.errorMessage
      }
    case Actions.SET_USER_INFO:
      return {
        ...state,
        currentLoggedInUser: action.currentLoggedInUser,
      };
    case Actions.LOGOUT_USER:
      return {
        ...state,
        currentLoggedInUser: null,
      };
    case Actions.SET_IS_ROOM_HOST:
      return {
        ...state,
        isRoomHost: action.isRoomHost,
      };
    case Actions.SET_CONNECT_ONLY_WITH_AUDIO:
      return {
        ...state,
        connectOnlyWithAudio: action.onlyWithAudio,
      };
    case Actions.SET_ROOM_ID:
      return {
        ...state,
        roomId: action.roomId,
      };
    case Actions.SET_IDENTITY:
      return {
        ...state,
        identity: action.identity,
      };
    case Actions.SET_SHOW_OVERLAY:
      return {
        ...state,
        showOverlay: action.showOverlay,
      };
    case Actions.SET_PARTICIPANTS:
      return {
        ...state,
        participants: action.participants,
      };
    case Actions.SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case Actions.SET_ACTIVE_CONVERSATION:
      return {
        ...state,
        activeConversation: action.activeConversation
      }
    case Actions.SET_DIRECT_CHAT_HISTORY:
      return {
        ...state,
        directChatHistory: action.directChatHistory
      };
    case Actions.SET_SOCKET_ID:
      return {
        ...state,
        socketId: action.socketId
      }
    default:
      return state;
  }
};

export default reducer;
