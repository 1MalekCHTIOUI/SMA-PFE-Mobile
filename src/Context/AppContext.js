import axios from 'axios'
import React, {createContext, useState, useRef, useEffect} from 'react'
import { useSelector } from 'react-redux'
import config from '../config'
import {ActivityIndicator,Alert,View} from 'react-native'
import { io } from 'socket.io-client'

const AppContext = createContext()




const ContextProvider = ({children}) => {
    const [rooms, setRooms] = useState([])
    const [currentChatUser, setCurrentChatUser] = useState(null)
    const [id, setId] = useState(null)
    const [messages, setMessages] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [existInRoom, setExistInRoom] = useState(null)
    const [profilePicture, setProfilePicture] = useState('')
    const [appLoading, setAppLoading] = useState(true)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [ROOM_ID, setROOM_ID] = useState('')

    const account = useSelector(s => s.account)
    const socket = io.connect(config.SOCKET_SERVER)


    const [callerId, setCallerId] = useState('')
    const [declineInfo, setDeclineInfo] = useState(null)
    const [callAccepted, setCallAccepted] = useState(false)
    const [callDeclined, setCallDeclined] = useState(false)
    const [callerMsg, setCallerMsg] = useState("")
    const [isReceivingCall, setIsReceivingCall] = useState(false)
    const [arrivalMessage, setArrivalMessage] = React.useState(null)
    const [adminMessage, setAdminMessage] = React.useState(null)
    const [groupMembers, setGroupMembers] = React.useState([])

    const [userGroups, setUserGroups] = React.useState([])

    const [arrivalNotification, setArrivalNotification] = React.useState(null)

    useEffect(() => {

        // const LOGO = require('/public/uploads/profilePictures/'+account.user.profilePicture)
        if(account.token) {
            // setProfilePicture(LOGO)
            socket.emit("addUser", account?.user._id)
        }
    }, [account])
    
    useEffect(() => {
        setAppLoading(false)
    }, [])



    const join = (ROOM_ID, type) => {
        history.push({pathname: `/videochat/${ROOM_ID}`, state: {allowed: true, callData, type}})
    }

    const handleCallButton = (val) => {
        const uid = v4()
        socket.emit("callNotif", {
            caller: {fullName: `${account?.user.first_name} ${account?.user.last_name}`, id: account?.user._id}, 
            id: val._id,
            room: uid
        })
        setROOM_ID(uid)

    }

    React.useEffect(()=>{
        socket.on("getUsers", users => {
            setOnlineUsers(users)
        })
        socket.on("getMessage", async data => {
            try {
                if(data.senderId==='CHAT') {
                    setAdminMessage({
                        sender: data.senderId,
                        text: data.text,
                        createdAt: Date.now()
                    })
                } 

                const res = await axios.get(config.API_SERVER+'user/users/'+data.senderId)
                Alert.alert(
                    res.data.first_name +" "+ res.data.last_name,
                    data.text,
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "Go", onPress: () => userHasRoom(res.data)}
                    ]
                  );
                setArrivalMessage({
                    sender: data.senderId,
                    text: data.text,
                    createdAt: Date.now(),
                    roomType: data.roomType
                })
                
            } catch (error) {
                console.log(error);
            }
        })

        socket.on('getNotification', async data => {
            console.log("got notif");
            try {
                const res = await axios.get(config.API_SERVER+'user/users/'+data.senderId)
                // openNotification('Group', {sender: `${res.data.first_name} ${res.data.last_name}`, text: data.content}, 'notif')
                setArrivalNotification({
                    title: 'Group',
                    sender: data.senderId,
                    content: data.content,
                    createdAt: Date.now(),
                    read: false
                })
            } catch(e) {console.log(e)}

        })

        socket.on("getCallerID", (data)=>{
            setCallerId(data)
        })

        socket.on("notif", data => {
            console.log("receiving call");
            setCallerMsg(data.msg)
            setCallData(prev => ({...prev, receiver: data.caller}))
            setIsReceivingCall(true)
        })
    
        socket.on("callAccepted", (acceptName, status) => {
            setCallData(prev => ({...prev, receiver: acceptName.acceptName}))
            socket.on("getRoomID", data => setROOM_ID(data))
            setIsReceivingCall(false)
            setCallAccepted(true)
        })
    
        socket.on("callDeclined", (data) => {
            console.log("call declined");
            setIsReceivingCall(false)
            setCallDeclined(true)
            setDeclineInfo(data.msg)
        })


    },[socket])

    const sendMessage = async (senderId, receiverId, newMessage, roomType) => {
        // await sendMessageNotification(senderId, receiverId, newMessage)
        socket.emit("sendMessage", {
            senderId: senderId,
            receiverId,
            text: newMessage,
            roomType
        })
    }


    const userHasRoom = async (user) => {
        try {
            setId(user._id)
            setCurrentChatUser(user)
            const res = await axios.get(config.API_SERVER + "rooms/" + user._id)
            if(res.data.length === 0) {
                console.log("No room found");
            }
            const resp = res.data.map(room => {
                if(room.members.includes(account.user._id) && room.type==='PRIVATE'){
                    setCurrentChat(room)
                    return true
                }
                else {
                    return false
                }
            })

            if(resp.includes(true)) {
                setExistInRoom(true)
            } else {
                setExistInRoom(false)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AppContext.Provider value={{onlineUsers, arrivalMessage, profilePicture, messages, messagesLoading,handleCallButton, sendMessage, setMessagesLoading, setMessages,userHasRoom, account, existInRoom, setExistInRoom, currentChatUser, setCurrentChatUser, currentChat, setCurrentChat, id, setId}}>
            {appLoading && <View style={{position:'absolute', left: '50%', right: '50%'}}><ActivityIndicator size='large'/></View> }
            {isReceivingCall && alert('YOUR BEING CALLED')}
            {children}
            
        </AppContext.Provider>
    )
}

export {ContextProvider, AppContext}