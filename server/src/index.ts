import express from "express"
import http from "http"
import { v4 as uuidv4 } from "uuid"
import cors from "cors"
import twilio from "twilio"
import dotenv from 'dotenv'
import cohere from 'cohere-ai'
import authRoutes from './routes/auth'
import path from "path"
import { getAuthUser, getAuthUserFromJwt } from "./utils/getAuthUser"
import { jwtUserPayloadType } from "./utils/getAuthToken"
import { meeting_room, PrismaClient } from "@prisma/client"
import language from '@google-cloud/language'

const client = new language.LanguageServiceClient();


dotenv.config()

const prisma = new PrismaClient()

const PORT = process.env.PORT || 5002
const app = express()
const server = http.createServer(app)

app.set('trust proxy', true);
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use(express.static(path.join(__dirname, 'build')));


let connectedUsers: any = []
let roomsConnectedUsers: {
    roomId: string,
    connectedUsers: any
}[] = []

const cohereApiKey = process.env.COHERE_API_KEY
if (!cohereApiKey) throw "Invalid cohere API"

app.get("/api/get-turn-credentials", (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN

    const client = twilio(accountSid, authToken)

    res.send({ token: null })
    try {
        client.tokens.create().then((token) => {
            res.send({ token })
        })
    } catch (err) {
        console.log("error occurred when fetching turn server credentials")
        console.log(err)
        res.send({ token: null })
    }
})

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket: any) => {
    console.log(`user connected ${socket.id}`)

    socket.on("create-new-room", (data: any) => {
        console.error('Invalid event create-new-room')
        // createNewRoomHandler(data, socket)
    })

    socket.on("join-room", (data: any) => {
        joinRoomHandler(data, socket)
    })

    socket.on("disconnect", () => {
        disconnectHandler(socket)
    })

    socket.on("conn-signal", (data: any) => {
        signalingHandler(data, socket)
    })

    socket.on("conn-init", (data: any) => {
        initializeConnectionHandler(data, socket)
    })

    socket.on("direct-message", (data: any) => {
        directMessageHandler(data, socket)
    })
})

// socket.io handlers
// const createNewRoomHandler = async (data: any, socket: any) => {
//     console.log("host is creating a new room")
//     console.log(data)
//     const { roomTitle, onlyAudio, jwtToken } = data;

//     if(!roomTitle){
//         console.error('No roomTitle')
//         // send error message
//         io.to(socket.id).emit('conn-error', {
//             errorMessage: 'No roomTitle'
//         })
//         return;
//     }
//     let user: jwtUserPayloadType;
//     try{
//         const result=getAuthUserFromJwt(jwtToken)
//         if(!result){
//             throw new Error('Something went wrong with jwt. [141]')
//         }
//         user=result;
//     }catch(err){
//         console.error('No jwtToken')
//         // send error message
//         io.to(socket.id).emit('conn-error', {
//             errorMessage: 'No jwt Token'
//         })
//         return;
//     }
//     const roomId = uuidv4()
//     const identity=user.name

//     // create new user
//     const newUser = {
//         identity,
//         id: uuidv4(),
//         socketId: socket.id,
//         roomId,
//         onlyAudio,
//     }

//     // push that user to connectedUsers
//     connectedUsers = [...connectedUsers, newUser]

//     //create new room
//     const newRoom = {
//         id: roomId,
//         connectedUsers: [newUser],
//     }
//     // join socket.io room
//     socket.join(roomId)

//     rooms = [...rooms, newRoom]
//     console.log(rooms)
//     // emit to that client which created that room roomId
//     socket.emit("room-id", { roomId })

//     // emit an event to all users connected
//     // to that room about new users which are right in this room
//     socket.emit("room-update", { connectedUsers: newRoom.connectedUsers })
// }

const joinRoomHandler = async (data: { roomId: any; onlyAudio: any; jwtToken: string }, socket: { id: any; join: (arg0: any) => void }) => {

    console.log('args', data)
    const { roomId, onlyAudio, jwtToken } = data

    let user: jwtUserPayloadType;
    try {
        const result = getAuthUserFromJwt(jwtToken)
        if (!result) {
            throw new Error('Something went wrong with jwt. [141]')
        }
        user = result;
    } catch (err) {
        console.error('No jwtToken')
        // send error message
        io.to(socket.id).emit('conn-error', {
            errorMessage: 'No jwt Token'
        })
        return;
    }
    const identity = user.name
    const newUser = {
        identity,
        id: uuidv4(),
        socketId: socket.id,
        roomId,
        onlyAudio,
    }
    let localRoomInstance = roomsConnectedUsers.find((room) => room.roomId === roomId)

    let room: meeting_room;
    try {
        // join room as user which just is trying to join room passing room id
        const tmpRoom = await prisma.meeting_room.findFirst({
            where: {
                id: roomId
            }
        })
        if (!tmpRoom) {
            throw new Error(`1Invalid room Id: ${roomId}`)
        }
        room=tmpRoom
    } catch (err) {
        console.error('1Invalid room Id: ', roomId, localRoomInstance)
        io.to(socket.id).emit('conn-error', {
            errorMessage: 'Invalid room Id. Are you sure that the meeting exists? 🤔'
        })
        return;
    }

    if (!localRoomInstance) {
        localRoomInstance = {
            roomId: room.id,
            connectedUsers: []
        }
        roomsConnectedUsers = [...roomsConnectedUsers, localRoomInstance]
    }

    // make this user as one of the participant
    const participantInstance = await prisma.participant.findFirst({
        where: {
            meeting_id: roomId,
            user_id: user.id
        }
    })

    try {
        // perform the following update or create asynchronously
        if (participantInstance) {
            // update
            const instance = await prisma.participant.update({
                where: {
                    meeting_user_id: participantInstance.meeting_user_id,
                },
                data: {
                    last_joined_at: new Date()
                }
            })
            console.log(instance)
        } else {
            // create
            const instance = await prisma.participant.create({
                data: {
                    meeting_id: roomId,
                    user_id: user.id
                }
            })
            console.log('aa', instance)
        }
    } catch (err) {
        console.error("152: ", err.message)
    }

    localRoomInstance.connectedUsers = [...localRoomInstance.connectedUsers, newUser]

    // join socket.io room
    socket.join(roomId)

    // add new user to connected users array
    connectedUsers = [...connectedUsers, newUser]

    // emit to all users which are already in this room to prepare peer connection
    localRoomInstance.connectedUsers.forEach((user: { socketId: any }) => {
        if (user.socketId !== socket.id) {
            const data = {
                connUserSocketId: socket.id,
            }

            io.to(user.socketId).emit("conn-prepare", data)
        }
    })

    io.to(roomId).emit("room-update", { connectedUsers: localRoomInstance.connectedUsers })
}

const disconnectHandler = (socket: { id: any; leave: (arg0: any) => void }) => {
    // find if user has been registered - if yes remove him from room and connected users array
    const user = connectedUsers.find((user: { socketId: any }) => user.socketId === socket.id)

    if (user) {
        // remove user from room in server
        const room = roomsConnectedUsers.find((room) => room.roomId === user.roomId)
        if (!room) {
            console.error('2Invalid room Id: ', user.roomId)
            return;
        }

        room.connectedUsers = room.connectedUsers.filter(
            (user: { socketId: any }) => user.socketId !== socket.id
        )

        // leave socket io room
        socket.leave(user.roomId)

        // close the room if amount of the users which will stay in room will be 0
        if (room.connectedUsers.length > 0) {
            // emit to all users which are still in the room that user disconnected
            io.to(room.roomId).emit("user-disconnected", { socketId: socket.id })

            // emit an event to rest of the users which left in the toom new connectedUsers in room
            io.to(room.roomId).emit("room-update", {
                connectedUsers: room.connectedUsers,
            })
        } else {
            roomsConnectedUsers = roomsConnectedUsers.filter((r) => r.roomId !== room.roomId)
        }
    }
}

// create route to check if room exists
app.get("/api/room-exists/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params

        const meeting = await prisma.meeting_room.findFirst({
            where: {
                id: roomId
            },
        })

        if (meeting) {
            const room = roomsConnectedUsers.find(e => e.roomId === roomId)
            // send reponse that room exists
            if (room?.connectedUsers.length > 3) {
                return res.send({ roomExists: true, full: true })
            } else {
                return res.send({ roomExists: true, full: false })
            }
        } else {
            // send response that room does not exists
            return res.send({ roomExists: false })
        }
    } catch (err) {
        return res.send({ roomExists: false })
    }
})


const signalingHandler = (data: { connUserSocketId: any; signal: any }, socket: { id: any }) => {
    const { connUserSocketId, signal } = data

    const signalingData = { signal, connUserSocketId: socket.id }
    io.to(connUserSocketId).emit("conn-signal", signalingData)
}

// information from clients which are already in room that They have preapred for incoming connection
const initializeConnectionHandler = (data: { connUserSocketId: any }, socket: { id: any }) => {
    const { connUserSocketId } = data

    const initData = { connUserSocketId: socket.id }
    io.to(connUserSocketId).emit("conn-init", initData)
}

const directMessageHandler = (data: { receiverSocketId: any; messageContent: any; identity: any }, socket: { id: any; to: (arg0: any) => { (): any; new(): any; emit: { (arg0: string, arg1: { authorSocketId: any; messageContent: any; isAuthor: boolean; identity: any }): void; new(): any } }; emit: (arg0: string, arg1: { receiverSocketId: any; messageContent: any; isAuthor: boolean; identity: any }) => void }) => {
    if (
        connectedUsers.find(
            (connUser: { socketId: any }) => connUser.socketId === data.receiverSocketId
        )
    ) {
        const receiverData = {
            authorSocketId: socket.id,
            messageContent: data.messageContent,
            isAuthor: false,
            identity: data.identity,
        }
        socket.to(data.receiverSocketId).emit("direct-message", receiverData)

        const authorData = {
            receiverSocketId: data.receiverSocketId,
            messageContent: data.messageContent,
            isAuthor: true,
            identity: data.identity,
        }

        socket.emit("direct-message", authorData)
    }
}



const findSentiment = async (text: string) => {
    const result = await client.analyzeSentiment({
        document: {
            type: 'PLAIN_TEXT',
            content: text
        }
    })
    console.log(result)
    const val = result[0].documentSentiment?.score
    if (val && val >= 0.5) {
        return 1;
    } else if (val && val < -0.5) {
        return -1;
    } else {
        return 0;
    }
}



app.post('/api/findSentiment', async (req, res) => {
    try {
        const data = req.body.message
        res.send({
            sentiment: await findSentiment(data)
        })
    } catch (err) {
        console.log(err)
        res.send({
            sentiment: 0
        });
    }
})



app.post("/api/summarize", async (req, res) => {
    try {
        cohere.init(cohereApiKey)
        const { input } = req.body;
        const response = await cohere.generate({
            model: "large",
            prompt: `Passage: Is Wordle getting tougher to solve? Players seem to be convinced that the game has gotten harder in recent weeks ever since The New York Times bought it from developer Josh Wardle in late January. The Times has come forward and shared that this likely isn’t the case. That said, the NYT did mess with the back end code a bit, removing some offensive and sexual language, as well as some obscure words There is a viral thread claiming that a confirmation bias was at play. One Twitter user went so far as to claim the game has gone to “the dusty section of the dictionary” to find its latest words.\n\nTLDR: Wordle has not gotten more difficult to solve.\n--\nPassage: ArtificialIvan, a seven-year-old, London-based payment and expense management software company, has raised $190 million in Series C funding led by ARG Global, with participation from D9 Capital Group and Boulder Capital. Earlier backers also joined the round, including Hilton Group, Roxanne Capital, Paved Roads Ventures, Brook Partners, and Plato Capital.\n\nTLDR: ArtificialIvan has raised $190 million in Series C funding.\n--\n Passage: ${input} \n\nTLDR: `,
            max_tokens: 70,
            temperature: 0.8,
            k: 0,
            p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop_sequences: ["--"],
            return_likelihoods: "NONE",
        });


        console.log(response.body)
        console.log(response.body.generations[0])

        res.status(200).json({ summary: response.body.generations[0].text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ summary: "Error" });
    }
});


app.post('/api/broadcastMessage', async (req, res) => {
    try {
        const data: {
            roomId: string,
            messageContent: string,
            sentiment: number,
            jwtToken: string
        } = req.body

        let user: jwtUserPayloadType;
        const result = getAuthUserFromJwt(data.jwtToken)
        if (!result) {
            throw new Error('Something went wrong. Couldn\'t extract user from jwt')
        }
        user = result;


        const instance = await prisma.incall_message.create({
            data: {
                sender_id: user.id,
                text: data.messageContent,
                englishTranslatedText: data.messageContent,
                meeting_id: data.roomId, // we don't need to validate it. :)
                sentiment: data.sentiment
            }
        })

        res.send({
            error: false,
            instance
        })
    } catch (err) {
        console.log(err)
        res.send({
            error: true,
            message: 'something went wrong [1912]'
        });
    }
})




app.get('/api/transcripts/:meet_id', async (req, res) => {
    try {
        const user = getAuthUser(req);
        const meetId = req.params.meet_id


        const meeting = await prisma.meeting_room.findFirst({
            where: {
                id: meetId
            },
            include: {
                owner: true,
                _count: {
                    select: {
                        participant: true
                    }
                },
            },
        })

        if (!meeting) throw new Error('[161]: Invalid meeting Id')

        const messages = await prisma.incall_message.findMany({
            where: {
                meeting_id: meetId,
            },
            include: {
                sender: true,
            },
            orderBy: {
                sent_at: 'desc'
            }
        })


        return res.send({
            error: false,
            meeting: {
                ...meeting,
                am_i_the_owner: meeting?.owner_id === user?.id,
                participants_count: meeting?._count.participant,
            },
            messages
        })


    } catch (err) {
        return res.send({
            error: true,
            message: err.message
        })
    }
})



app.get('/api/meetings', async (req, res) => {
    try {
        const user = getAuthUser(req);


        const meetings = await prisma.meeting_room.findMany({
            where: {
                participant: {
                    some: {
                        user_id: user?.id
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        participant: true
                    }
                },
                owner: true,
            },
            orderBy: {
                created_time: 'desc'
            }
        })


        return res.send({
            error: false,
            meetings: meetings.map(e => ({
                id: e.id,
                title: e.title,
                owner: e.owner,
                participants_count: e._count.participant,
                created_time: e.created_time,
                am_i_the_owner: e.owner_id === user?.id
            }))
        })


    } catch (err) {
        return res.send({
            error: true,
            message: err.message
        })
    }
})

app.post('/api/room/create', async (req, res) => {
    const data: {
        roomTitle: string,
        connectOnlyWithAudio: boolean,
        jwtToken: string
    } = req.body;

    console.log("Acac", req.body)
    let user: jwtUserPayloadType;
    try {
        const result = getAuthUserFromJwt(data.jwtToken)
        if (!result) {
            throw new Error('Something went wrong. Couldn\'t extract user from jwt')
        }
        user = result;
    } catch (err) {
        return res.send({
            error: true,
            message: err.message
        })
    }

    // create a room
    const newMeeting = await prisma.meeting_room.create({
        data: {
            title: data.roomTitle,
            owner_id: user.id,
        }
    })

    roomsConnectedUsers = [...roomsConnectedUsers, {
        roomId: newMeeting.id,
        connectedUsers: [], // not even the owner is connected yet!
    }]


    return res.send({
        error: false,
        roomId: newMeeting.id
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
})



server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})




