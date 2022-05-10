import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {View, Image, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView} from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import CustomButton from '../../components/CustomButton';
import config from '../../config';
import { AppContext } from '../../Context/AppContext';
import { LOGOUT } from '../../redux/actions'
import Room from '../Room';
import Message from '../../components/Message';
import { useNavigation } from '@react-navigation/native';
import { format } from 'timeago.js';

const ChatScreen = () => {
    const [rooms, setRooms] = useState([])
    const navigation = useNavigation()
    const [messagesLoading, setMessagesLoading] = useState([])

    const { id, setMessages, setId, messages, setCurrentChat, currentChat, setCurrentChatUser, existInRoom, account } = useContext(AppContext)

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
    useEffect(()=>{
        getMessages()
    }, [currentChat])

    useEffect(()=>{
        if(currentChat) {
            navigation.navigate('Messages')
        }
    }, [currentChat])

    
    useEffect(()=>{
        getPrivateRooms()
        getLastRoomMessage()
    }, [rooms])


    const [privateRooms, setPrivateRooms] = useState([])
    const getPrivateRooms = () => {
        rooms?.map(item => {
            if(item.type === 'PRIVATE') {
                item.members.map(async m => {
                    if(m !== account.user._id) {
                        try {
                            const user = await axios.get(config.API_SERVER+'user/users/'+m)
                            if(privateRooms?.some(user => user._id === user.data._id)===false){
                                setPrivateRooms(prev => [...prev, {user: user.data, lastMessage: item.last_message}])
                            }
                               
                        }catch (e) {
                            console.log(error);
                        }
                    }
                })
            }
        })
    }
    const [lastMessage, setLastMessage] = useState('')
    const [unreadMessages, setUnreadMessages] = useState({receiver: '', count: 0})

    
    const getLastRoomMessage = async () => {
        try {
            rooms?.map(async room => {
                if(room.members.includes(account.user._id) && room.type==='PRIVATE'){
                    try {
                        room.members.map( async item => {
                            if(item !== account.user._id){
                                const lastMessage = await axios.get(config.API_SERVER + 'messages/lastMessage/'+room._id)
                                setLastMessage({receiver: item, message: lastMessage.data})
                                try {
                                    const messages = await axios.get(config.API_SERVER + 'messages/'+room._id)
                                    messages.data.map(message => {
                                        if(message.read===false){
                                            console.log(message);
                                            setUnreadMessages({receiver: item, count: unreadMessages.count + 1})
                                        }
                                    })
                                } catch (err) {console.log(err)}
                            }
                        })
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const PrivateRooms = () => {
        return privateRooms?.map(item => (
            <SafeAreaView style={styles.convContainer} key={item.user._id}>
                <Image style={styles.convImage} source={require('../../../public/uploads/profilePictures/camp.png')} />
                <SafeAreaView style={styles.convMiddleSection}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 15
                    }}>{item.user.first_name}</Text>
                    <Text>{item.user._id === lastMessage.receiver && lastMessage.message?.text}</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.convEndSection}>
                    <Text >{format(lastMessage.message?.createdAt)}</Text>
                    <Text style={styles.convMessageCount}>{item.user._id === unreadMessages.receiver ? unreadMessages.count: 0}</Text>
                </SafeAreaView>
            </SafeAreaView>
        ))
    }

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
                <Text style={styles.allChat}>All Chat</Text>
                {PrivateRooms()}
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
        backgroundColor: 'white'
    },
    allChat: {
        alignSelf: 'flex-start',
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },

    convContainer: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 10,
        width: '95%',
        borderRadius: 5,
    }, 
    convImage: {
        width: 50,
        height: 50,
        borderRadius: 150,
        flexBasis: '14%'

    },
    convMiddleSection: {
        marginLeft: 10,
        flexDirection: 'column',
        flexBasis: '50%',
    },
    convEndSection: {
        marginLeft: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexBasis: '25%',
    },
    convMessageCount: {
        backgroundColor: 'orange',
        fontSize: 15,
        width: 20,
        height: 20,
        borderRadius: 50,
        textAlign: 'center',
        color: 'white',
    }
})

export default ChatScreen;
