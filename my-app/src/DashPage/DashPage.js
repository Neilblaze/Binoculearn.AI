import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../IntroductionPage/Navbar"
import { GET_ALL_MEETINGS } from "../utils/api";



const DashPage = ({ logoutUserAction, currentLoggedInUser }) => {

    const [totalNumberOfMeetingsAttended, setTotalNumberOfMeetingsAttended] = useState(0);
    const [totalNumberOfMeetingsHosted, setTotalNumberOfMeetingsHosted] = useState(0);


    const [meetings, setMeetings] = useState([])


    useEffect(() => {
        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_COOKIE_KEY) ?? ""
        axios.get(GET_ALL_MEETINGS, {
            headers: {
                'Authorization': token
            }
        }).then(e => {
            console.log(e.data)
            setMeetings(e.data.meetings)
            setTotalNumberOfMeetingsAttended(e.data.meetings.length)
            let tmpTotalNumberOfMeetingsOwned = 0;
            e.data.meetings.forEach(e => tmpTotalNumberOfMeetingsOwned += (!!e.am_i_the_owner))
            setTotalNumberOfMeetingsHosted(tmpTotalNumberOfMeetingsOwned)
        }).catch(err => {
            toast.error(err.message)
            toast.info('Redirecting back to home screen...', {
                onClose: () => {
                    window.location.href = window.location.origin;
                }
            })
        })
    }, [])


    return (
        <div className="bg-gray-800 pb-36 min-h-screen">
            <Navbar logoutUserAction={logoutUserAction} currentLoggedInUser={currentLoggedInUser} />

            <div className="px-10">
                <div className="text-gray-100 lowercase text-2xl font-medium mb-5">
                    Dashboard
                </div>

                <div className="grid grid-cols-2 gap-2 items-center max-w-2xl text-gray-300">
                    <div>
                        Total number of meetings attended:
                    </div>
                    <div className="font-bold text-yellow-500">
                        {totalNumberOfMeetingsAttended}
                    </div>

                    <div>
                        Total number of meetings hosted:
                    </div>
                    <div className="font-bold text-yellow-500">
                        {totalNumberOfMeetingsHosted}
                    </div>
                </div>



                <div className="mt-10 mb-20 flex flex-wrap justify-center gap-10">
                    {(!meetings || meetings.length === 0) && <div className="alert alert-info">No meetings found. 🥲</div>}
                    {meetings.map((e, indx) => {
                        return (
                            <div key={indx} className="card card-compact w-10/12 sm:w-80 bg-base-100 shadow-xl">
                                <figure><img className="h-[200px] w-full bg-gray-300" src={`https://api.lorem.space/image/pizza?w=288&h=20${indx}`} alt="Shoes" /></figure>
                                <div className="card-body">
                                    <h2 className="card-title">Meeting Title: {e.title}</h2>
                                    <p><span className="text-gray-500"> Hosted at:</span> <span className="font-medium">{new Date(e.created_time).toLocaleString()}</span></p>
                                    <p><span className="text-gray-500">Number of participants:</span> <span className="font-medium">{e.participants_count}+</span> </p>

                                    <div className="flex text-xs justify-end gap-1 items-center">
                                        <div className="text-gray-400">Hosted by:</div>
                                        <div className="avatar">
                                            <div className="w-5 rounded-full">
                                                <img src={e.owner.picture} />
                                            </div>
                                        </div>
                                        <div>
                                            {e.am_i_the_owner ? 'you' : e.owner.name.split(' ')[0]}
                                        </div>
                                    </div>
                                    <div className="card-actions justify-end mt-3">
                                        <Link to={`/transcripts/${e.id}`}>
                                            <button className="btn btn-primary btn-sm w-full">Meeting Transcripts & Summary</button>
                                        </Link>

                                        <Link to={`/room/${e.id}`}>
                                            <button className="btn btn-success btn-sm w-full">Join/Resume Meet</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

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
        //   setIsRoomHostAction: (isRoomHost) => dispatch(setIsRoomHost(isRoomHost)),
        //   logoutUserAction: () => dispatch(logoutUser())
    }
}

export default connect(mapStoreStateToProps, mapActionsToProps)(DashPage);
