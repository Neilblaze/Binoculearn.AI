import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux"
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../IntroductionPage/Navbar"
import { sentimentToEmoji } from "../RoomPage/ChatSection/Messages";
import { GET_ALL_MEETINGS, GET_SUMMARY_URL, GET_TRANSCRIPTS } from "../utils/api";


const MeetDetailsPage = ({ logoutUserAction, currentLoggedInUser }) => {
    // const [totalNumberOfMeetingsAttended, setTotalNumberOfMeetingsAttended] = useState(10);
    // const [totalNumberOfMeetingsHosted, setTotalNumberOfMeetingsHosted] = useState(0);


    const { meet_id: meetId } = useParams()
    const [meeting, setMeeting] = useState(null)
    const [messages, setMessages] = useState([])

    const [meetSummary, setMeetSummary] = useState(null)



    useEffect(() => {
        if (!meetId) return;

        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_COOKIE_KEY) ?? ""
        axios.get(GET_TRANSCRIPTS(meetId), {
            headers: {
                'Authorization': token
            }
        }).then(e => {
            console.log(e.data)
            setMeeting(e.data.meeting)
            setMessages(e.data.messages)
            // setMeetings(e.data.meetings)
            // setTotalNumberOfMeetingsAttended(e.data.meetings.length)
            // let tmpTotalNumberOfMeetingsOwned = 0;
            // e.data.meetings.forEach(e => tmpTotalNumberOfMeetingsOwned += (!!e.am_i_the_owner))
            // setTotalNumberOfMeetingsHosted(tmpTotalNumberOfMeetingsOwned)
        }).catch(err => {
            toast.error(err.message)
            toast.info('Redirecting back to home screen...', {
                onClose: () => {
                    window.location.href = window.location.origin;
                }
            })
        })
    }, [meetId])


    return (
        <div className="bg-gray-800 pb-36 min-h-screen">
            <Navbar logoutUserAction={logoutUserAction} currentLoggedInUser={currentLoggedInUser} />

            <div className="px-10">
                <div className="text-gray-100 lowercase text-2xl font-medium mb-5">
                    Meeting Transcripts & Summary
                </div>
                {!meeting ?

                    <div className="alert alert-info">Loading...</div>
                    :


                    <div className="card w-10/12 mx-auto max-w-2xl text-gray-200 bg-gray-700 shadow-xl">
                        <figure><img className="h-[200px] w-full bg-gray-300" src={`https://api.lorem.space/image/pizza?w=${1000}&h=300`} alt="Shoes" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">Meeting Title: {meeting.title}</h2>
                            <p><span className="text-gray-400"> Hosted at:</span> <span className="font-medium">{new Date(meeting.created_time).toLocaleString()}</span></p>
                            <p><span className="text-gray-400">Number of participants:</span> <span className="font-medium">{meeting.participants_count}+</span> </p>

                            <div className="flex text-xs justify-end gap-1 items-center">
                                <div className="text-gray-400">Hosted by:</div>
                                <div className="avatar">
                                    <div className="w-5 rounded-full">
                                        <img src={meeting.owner.picture} />
                                    </div>
                                </div>
                                <div>
                                    {meeting.am_i_the_owner ? 'you' : meeting.owner.nammeeting.split(' ')[0]}
                                </div>
                            </div>
                            <div className="card-actions justify-end mt-3 flex-col items-end">
                                <Link to={`/room/${meeting.id}`}>
                                    <button className="btn btn-success btn-sm">Join/Resume Meet</button>
                                </Link>
                                <button className="btn btn-info btn-sm" onClick={async () => {
                                    try {
                                        setMeetSummary('')
                                        let text = '';
                                        messages.forEach(e => {
                                            text += `${e.text}.`
                                        })
                                        const response = await axios.post(GET_SUMMARY_URL, {
                                            input: text
                                        })
                                        const summaryRes = response.data.summary
                                        setMeetSummary(summaryRes)
                                    } catch (err) {
                                        setMeetSummary(null)
                                        toast.error(err.message)
                                    }
                                }}>Generate Summary</button>


                                {meetSummary !== null && <div className="bg-gray-600 w-full min-h-[100px] p-4 rounded-lg text-sm">
                                    <div className="bg-gray-600 w-full min-h-[100px] p-4 rounded-lg text-sm">
                                        {meetSummary === '' ? 'generating summary of this meet....' :

                                            <div>
                                                <div className="font-medium text-base mb-3">Meeting Summary</div>
                                                <div>
                                                    {meetSummary}
                                                </div>
                                            </div>}
                                    </div>
                                </div>}
                            </div>

                            <hr className="my-3" />
                            <div className="font-medium text-xl text-gray-100">
                                Meeting Q&A logs
                            </div>

                            <div>

                                {messages.map((e, indx) => (
                                    <div key={indx} className='flex flex-col items-end w-full'>


                                        <div className="flex justify-between w-full items-center">
                                            <div className="text-gray-300 text-xs">
                                                (Sentiment: {sentimentToEmoji(e.sentiment)})
                                            </div>

                                            <div className="rounded-xl px-4 py-1 mb-1 w-fit text-sm min-w-[200px] text-right bg-pink-500">
                                                {e.text}
                                            </div>
                                        </div>



                                        <div className="flex justify-between mb-4 w-full items-center">
                                            <div className="text-xs text-gray-400">
                                                Sent at: {new Date(e.sent_at).toLocaleString()}
                                            </div>

                                            <div className="flex gap-1 items-center text-xs">
                                                <div className="avatar">
                                                    <div className="w-5 rounded-full">
                                                        <img src={e.sender.picture} />
                                                    </div>
                                                </div>
                                                <div>
                                                    {e.sender.name}
                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>}
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

export default connect(mapStoreStateToProps, mapActionsToProps)(MeetDetailsPage);
