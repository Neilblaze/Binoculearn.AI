import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../resources/images/logo.png";
import { START_GOOGLE_SIGNIN } from "../utils/api";

export const Navbar = (props) => {
  const { currentLoggedInUser, logoutUserAction } = props

  return (
    <div className='' style={{}}>
      <header className='flex flex-col sm:flex-row justify-start sm:justify-between px-10 pt-5 sm:pt-0 gap-4'>
        <Link to='/'>
          <img src={logo} className='w-72'></img>
        </Link>

        <ul className='flex justify-end items-center'>
          {currentLoggedInUser ? <div className="flex gap-5 items-center">
            <div className="flex justify-center gap-2 items-center">
              <img className="w-8 h-8 rounded-full" src={currentLoggedInUser.picture} />
              Hi, {currentLoggedInUser.name.split(" ")[0]}! 👋


            </div>

            <div>
              <button onClick={() => logoutUserAction()} type="button" className="py-2 px-3 mr-2 mb-2 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Logout</button>
            </div>


          </div> : <button onClick={() => window.location.href = (START_GOOGLE_SIGNIN)} type="button" className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
            <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Sign in with Google
          </button>}

        </ul>
      </header>
    </div>
  );
};



export default Navbar
