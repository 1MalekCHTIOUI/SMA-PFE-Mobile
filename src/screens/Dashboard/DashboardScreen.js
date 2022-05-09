import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {View, Image, Text, StyleSheet, ActivityIndicator} from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import CustomButton from '../../components/CustomButton';
import config from '../../config';
import { AppContext } from '../../Context/AppContext';
import { LOGOUT } from '../../redux/actions'
import Room from '../Room';
import Message from '../../components/Message';
const DashboardScreen = () => {
    const [rooms, setRooms] = useState([])
    const [messages, setMessages] = useState([])
    const [messagesLoading, setMessagesLoading] = useState([])

    const { id, setId, setCurrentChat, currentChat, setCurrentChatUser, existInRoom, account } = useContext(AppContext)

    const dispatcher = useDispatch()

    const imageURL = `../../../public/uploads/profilePictures/${account.user.profilePicture}`

    const logout = () => {
        dispatcher({type: LOGOUT})
    }

    useEffect(()=>{
        async function getRooms() {
            try {
                const res = await axios.get(config.API_SERVER + "rooms/" + account.user._id)
                setRooms(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getRooms()
    }, [account])

    useEffect(()=>{
        const createUser = async () => {
            if(existInRoom === false) {
                try {
                    console.log("Room is about to be created...")
                    const members = {
                        senderId: account.user._id,
                        receiverId: id
                    }
                    const res = await axios.post(config.API_SERVER + "rooms", members)
                    setCurrentChat(res.data)
                } catch(err) {
                    console.log(err)
                }
            }
        }
        createUser()
    },[existInRoom])
    
    useEffect(()=>{
        const getMessages = async () => {
            setMessagesLoading(true)
            try {
                const res = await axios.get(config.API_SERVER + "messages/" + currentChat?._id)
                setMessages(res.data)
                setMessagesLoading(false)
            } catch (error) {
                console.log(error.message)
            }
        }
        getMessages()
    }, [currentChat])

    return (
        <View style={styles.container}>
            <CustomButton onPress={logout} text='Logout' />
            <View style={styles.welcome}>
                <Text style={{fontSize: 15}}>{ `${account?.user.first_name} ${account?.user.last_name}` }</Text>
            </View>
            <View style={styles.header}>
                <Room />
            </View>
            <View style={styles.content}>
            { currentChat && currentChat.type==='PRIVATE' && messages?.length === 0 && <Text variant="subtitle2">You no conversation with this user, start now!</Text> }
            {
                currentChat? 
                    <View style={styles.messageArea}>
                        {messagesLoading && <ActivityIndicator />}
                            {messages && messages.map((m, i) => (
                                <Message message={m} own={m.sender === account.user._id} type={currentChat.type} key={i} mk={i}/>
                            ))}
                        {/* <div ref={scrollRef} /> */}
                    </View>
                
                : null
            }

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    welcome: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '5%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
    }, 
    header: {
        width: '100%',
        height: '15%',
        padding: 8,
    }, 
    content: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    image: {
        backgroundColor: 'red',

        height: 200,
        width: 200,
    },
    messageArea: {
        height: 70,
        padding: 10,
        overflowY: 'auto',
        overflowX: 'hidden'
    },
})

export default DashboardScreen;
