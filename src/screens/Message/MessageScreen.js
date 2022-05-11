import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { AppContext } from '../../Context/AppContext';
import Message from '../../components/Message'; 
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import config from '../../config';
import Icon from 'react-native-vector-icons'
const MessageScreen = () => {
    const navigation = useNavigation()
    const { currentChat,setCurrentChat, messages, setMessages, messagesLoading, sendMessage, currentChatUser, account } = useContext(AppContext)
    const [newMessage, setNewMessage] = useState('')
    const [sendIsLoading, setSendIsLoading] = useState(false)


    useEffect(() => {
        navigation.setOptions({ title: `${currentChatUser.first_name} ${currentChatUser.last_name}` })
        return ()=>setCurrentChat(null)
    }, []);

    const readMessages = () => {
        try {
            
        } catch (error) {
            
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const message= {
            roomId: currentChat._id,
            sender: account.user._id,
            text: newMessage,
            attachment: []
        }
        const receiverId = currentChat.members.find(m => m !== account.user._id)
        try {
            setSendIsLoading(true)
            const res = await axios.post(config.API_SERVER+"messages", message)
            setMessages([...messages, res.data])
            setNewMessage("")
            setSendIsLoading(false)
            sendMessage(message.sender, receiverId, newMessage, currentChat.type)
        } catch (error) {
            setSendIsLoading(false)
            console.log(error);
        }
    }

    return (
        <View>
            { currentChat && currentChat.type==='PRIVATE' && messagesLoading===false && messages?.length === 0 && <Text variant="subtitle2">You no conversation with this user, start now!</Text> }
            {
                currentChat? 
                    <ScrollView style={styles.messageArea}>
                        <ActivityIndicator size='large' animating={messagesLoading} />
                        {messages && messages.map((m, i) => (
                            <Message message={m} own={m.sender === account.user._id} type={currentChat.type} key={i} mk={i}/>
                        ))}
                        <CustomInput value={newMessage} setValue={setNewMessage} placeholder='Send message' secureTextEntry={false} />
                        <CustomButton text="send" onPress={handleSubmit} />
                        <ActivityIndicator animating={sendIsLoading} />
                    </ScrollView>
                : null
            }

        </View>
    );
}

const styles = StyleSheet.create({
    messageArea: {
        borderRadius: 10,
        height: '80%',
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.02)',
    }
})

export default MessageScreen;
