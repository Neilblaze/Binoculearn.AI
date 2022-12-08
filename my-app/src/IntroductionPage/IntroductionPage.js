import React, { useEffect } from "react"
import rhs from "../resources/images/rhs.png"
import github from "../resources/images/GitHub.png"
import text from "../resources/images/text.png"

import ConnectingButtons from "./ConnectingButtons"
import { connect } from "react-redux"
import { logoutUser, setIsRoomHost } from "../store/actions"

import "./IntroductionPage.css"
import { useNavigate } from "react-router-dom"
import { Navbar } from "./Navbar"



const IntroductionPage = ({ setIsRoomHostAction,currentLoggedInUser,logoutUserAction }) => {
  useEffect(() => {
    setIsRoomHostAction(false)
  }, [])



  return (
    <div className='introduction_page_container'>
      <Navbar logoutUserAction={logoutUserAction} currentLoggedInUser={currentLoggedInUser}/>

      <div className='w-full justify-center mt-28 gap-24 flex'>
        <div className='flex flex-col'>
          <div
            className=''
          >
            <div className='introduction_page_panel'>
              <p className='main-text'>
                <span className='learn'>Learning</span> with <br></br>
                <span className='low-bandwidth'>low-bandwidth </span>
                internet.
              </p>
            </div>
          </div>
          <div className='connection_buttons_containers'>
            <ConnectingButtons isUserLoggedIn={!!currentLoggedInUser}/>
            <img
              style={{ width: "30rem", marginTop: "3rem" }}
              src={text}
              className='introduction_page_image'
            ></img>
          </div>
        </div>
        <div className=''>
          <div
            className='introduction_page_content'
            style={{ display: "flex" }}
          >
            <img style={{ width: "25rem" }} src={rhs} className=''></img>
          </div>
        </div>
      </div>
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
    setIsRoomHostAction: (isRoomHost) => dispatch(setIsRoomHost(isRoomHost)),
    logoutUserAction: () => dispatch(logoutUser())
  }
}

export default connect(mapStoreStateToProps, mapActionsToProps)(IntroductionPage)
