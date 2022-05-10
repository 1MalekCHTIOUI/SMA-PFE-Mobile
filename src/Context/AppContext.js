import React, {createContext, useState, useRef, useEffect} from 'react'
import { useSelector } from 'react-redux'


const AppContext = createContext()



const ContextProvider = ({children}) => {
    const [rooms, setRooms] = useState([])
    const [currentChatUser, setCurrentChatUser] = useState(null)
    const [id, setId] = useState(null)
    const [messages, setMessages] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [existInRoom, setExistInRoom] = useState(null)
    const account = useSelector(s => s.account)
    return (
        <AppContext.Provider value={{ messages, setMessages, account, existInRoom, setExistInRoom, currentChatUser, setCurrentChatUser, currentChat, setCurrentChat, id, setId}}>
            {children}
        </AppContext.Provider>
    )
}

export {ContextProvider, AppContext}