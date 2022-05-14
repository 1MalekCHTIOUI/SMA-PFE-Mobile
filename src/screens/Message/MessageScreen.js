import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator,SafeAreaView,TouchableOpacity,Image } from 'react-native';
import { AppContext } from '../../Context/AppContext';
import Message from '../../components/Message'; 
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import config from '../../config';
import Icon from 'react-native-vector-icons'
import Reinput from 'reinput'

import { addStr, generateRandomString, randomNumber } from '../../utils/scripts';
const MessageScreen = () => {
    const navigation = useNavigation()
    const { currentChat,onlineUsers,setCurrentChat, messages, arrivalMessage, setMessages, messagesLoading, sendMessage, handleCallButton, currentChatUser, account } = useContext(AppContext)
    const [newMessage, setNewMessage] = useState('')
    const [sendIsLoading, setSendIsLoading] = useState(false)

    useEffect(()=>{
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && currentChat.type === arrivalMessage.roomType &&
        setMessages(prev => [...prev, arrivalMessage])
    },[arrivalMessage])

    useEffect(() => {
        console.log(onlineUsers);
        navigation.setOptions({ 
            title:  <View>
                        <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 17}}>{currentChatUser.first_name} {currentChatUser.last_name}</Text>
                        <View style={{textAlign: 'center',flexDirection: 'row', marginTop: 4, justifyContent: 'center', alignItems: 'center'}}>
                            {
                                onlineUsers.some(user => user.userId === currentChatUser._id) ? (
                                    <>
                                        <View style={{borderRadius: 50, height: 10, width: 10, backgroundColor: 'green', marginRight: 5}} />
                                        <Text>Online</Text>
                                    </>) : (
                                        <>
                                            <View style={{borderRadius: 50, height: 10, width: 10, backgroundColor: 'red', marginRight: 5}} />
                                            <Text>Offline</Text>
                                        </>
                                    )
                            }
                        </View>
                    </View>,
            headerTitleStyle: {
              fontSize: 18,
              marginLeft: 75
            },
            headerShown: true,
            headerRight: () => (
                <TouchableOpacity text="send" onPress={() => handleCallButton(currentChatUser._id)}>
                    <Image style={{height: 25, width: 25, marginVertical: 20, marginRight: 20, tintColor: '#3B71F3'}} source={require('../../assets/images/phone-call.png')} resizeMode='contain' />
                </TouchableOpacity>
              ),
        })
        return () => {
            setCurrentChat(null); 
            navigation.navigate('Chats')
        }
    }, []);

    const readMessages = () => {
        try {
            
        } catch (error) {
            
        }
    }

    // const handleCallButton = (id) => {
    //     const data = {
    //         caller: account.user._id, 
    //         receiver: id
    //     }
    //     navigation.navigate('Videos', {data, type: 'PRIVATE'})
    // }
    const [file, setFile] = React.useState('')
    const [selectedFiles, setSelectedFiles] = React.useState([])
    // const onChangeFileUpload = e => {
    //     setSelectedFiles(prev => [...prev, e.target.files[0]])
    //     setFile(prev => [...prev, e.target.files[0]])

    // }
    // const handleDocumentSelection = useCallback(async () => {
    //     try {
    //       const response = await DocumentPicker.pick({
    //         presentationStyle: 'fullScreen',
    //       });
    //       setFile(response);
    //     } catch (err) {
    //       console.warn(err);
    //     }
    //   }, []);
    const handleSubmit = async (e) => {
        e.preventDefault()
        // const formData = new FormData();
        // const random = randomNumber()

        // let newName;
        // for (let x = 0; x < file.length; x++) {
        //     const dotIndex = file[0].name.indexOf('.')
        //     const newFilename = addStr(file[0].name, dotIndex, random)
        //     newName = newFilename
        //     formData.append(`files[${x}]`, file[x], newFilename);
        // }

        const message= {
            roomId: currentChat._id,
            sender: account.user._id,
            text: newMessage,
            attachment: []
        }
        // if(file){
        //     file?.map(file => {
        //         message.attachment = [...message.attachment, {
        //             displayName: file.name,
        //             actualName: newName
        //         }]
        //     })
        // }
        const receiverId = currentChat.members.find(m => m !== account.user._id)
        try {
            setSendIsLoading(true)
            const res = await axios.post(config.API_SERVER+"messages", message)
            setMessages([...messages, res.data])
            setNewMessage("")
            // try {
            //     if(message.attachment.length>0){
            //         await axios.post(config.API_SERVER+"upload/file", formData, { 
            //             headers: { 'Content-Type': 'multipart/form-data'}
            //         })
            //     }
            // } catch (error) {
            //     console.log(error.response.data.message);
            // } 
            setSendIsLoading(false)
            sendMessage(message.sender, receiverId, newMessage, currentChat.type)
        } catch (error) {
            setSendIsLoading(false)
            console.log(error);
        }
        setSelectedFiles([])
        setFile('')
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            { currentChat && currentChat.type==='PRIVATE' && messagesLoading===false && messages?.length === 0 && <Text style={{ position: 'absolute', left:'15%', top:'25%', fontWeight: 'bold'}}>You no conversation with this user, start now!</Text> }
            {
                <>
                    {currentChat? 
                        <ScrollView>
                            <ActivityIndicator size='large' style={{position: 'absolute', left: '45%'}} animating={messagesLoading} />
                            {messages && messages.map((m, i) => (
                                <Message message={m} own={m.sender === account.user._id} type={currentChat.type} key={i} mk={i}/>
                            ))}
                        </ScrollView>
                    : null}
                    <View style={styles.send}>
                        <View style={styles.input}>
                            <Reinput value={newMessage} fontSize={20} onChangeText={x => setNewMessage(x)} label='Send message' />
                        </View>

                        <TouchableOpacity text="send" onPress={handleSubmit}>
                            <Image style={{height: 30, width: 30, marginVertical: 20, marginLeft: 10}} source={require('../../assets/images/send.png')} resizeMode='contain' />
                        </TouchableOpacity>                        
                        <TouchableOpacity text="send" onPress={handleSubmit}>
                            <Image style={{height: 30, width: 30, marginLeft: 10,  marginVertical: 20,tintColor: 'tomato'}} source={require('../../assets/images/file.png')} resizeMode='contain' />
                        </TouchableOpacity>
                        <ActivityIndicator style={{position: 'absolute', left: '45%'}} animating={sendIsLoading} />                     
                    </View>
                </>
            }

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    messageArea: {
        height: '100%',
        flex: 1,
        padding: 8,
    },
    mainContainer: {
        flex: 1, 
        padding: 10,
        backgroundColor: 'white'
    },
    send: {
        flexDirection: 'row',
        width: '100%',
        padding: 10
    },
    input: {
        width: '80%',
    },
    tools: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: '10%',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor: 'rgba(0,0,0,0.1)'
    }
})

export default MessageScreen;
