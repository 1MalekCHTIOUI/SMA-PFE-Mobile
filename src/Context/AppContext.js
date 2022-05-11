import axios from 'axios'
import React, {createContext, useState, useRef, useEffect} from 'react'
import { useSelector } from 'react-redux'
import config from '../config'
import {ActivityIndicator} from 'react-native'
import { io } from 'socket.io-client'

const AppContext = createContext()


const socket = io.connect(config.SOCKET_SERVER)

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
    const account = useSelector(s => s.account)

    useEffect(() => {
        if(account?.token) {
            setProfilePicture('../../../public/uploads/profilePictures/'+account.user.profilePicture)
            socket.emit("addUser", account.user._id)
        }
    }, [account])

    useEffect(() => {
        setAppLoading(false)
    }, [])

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
                openNotification('New message', {sender: `${res.data.first_name} ${res.data.last_name}`, text: data.text}, 'message')
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
                openNotification('Group', {sender: `${res.data.first_name} ${res.data.last_name}`, text: data.content}, 'notif')
                setArrivalNotification({
                    title: 'Group',
                    sender: data.senderId,
                    content: data.content,
                    createdAt: Date.now(),
                    read: false
                })
            } catch(e) {console.log(e)}

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
        console.log("userHasRoom called");
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
        <AppContext.Provider value={{onlineUsers, messages, messagesLoading, sendMessage, setMessagesLoading, setMessages,userHasRoom, account, existInRoom, setExistInRoom, currentChatUser, setCurrentChatUser, currentChat, setCurrentChat, id, setId}}>
            {appLoading && <ActivityIndicator size='large'/> }
            {children}
            
        </AppContext.Provider>
    )
}

export {ContextProvider, AppContext}