import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AppContext} from '../../Context/AppContext';
import Message from '../../components/Message';
import {useNavigation} from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import config from '../../config';
import Icon from 'react-native-vector-icons';
import Reinput from 'reinput';
import GroupTools from '../../components/GroupTools';

import {launchImageLibrary} from 'react-native-image-picker';
const MessageScreen = () => {
  const navigation = useNavigation();
  const {
    currentChat,
    onlineUsers,
    setCurrentChat,
    messages,
    arrivalMessage,
    setMessages,
    messagesLoading,
    sendMessage,
    handleCallButton,
    adminMessage,
    currentChatUser,
    account,
    setMessageSent,
  } = useContext(AppContext);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();
  const [sendIsLoading, setSendIsLoading] = useState(false);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.some(u => u.userId === arrivalMessage.sender) &&
      currentChat._id === arrivalMessage.currentChat
    ) {
      setMessages(prev => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);
  React.useEffect(() => {
    adminMessage &&
      currentChat?._id === adminMessage.currentChat &&
      setMessages(prev => [...prev, adminMessage]);
  }, [adminMessage]);

  useEffect(() => {
    return () => {
      navigation.navigate('Chats') && setCurrentChat(null);
    };
  }, []);
  useEffect(() => {
    {
      currentChat?.type === 'PRIVATE' &&
        navigation.setOptions({
          title: (
            <View>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 17,
                  color: 'black',
                }}>
                {currentChatUser.first_name} {currentChatUser.last_name}
              </Text>
              <View
                style={{
                  textAlign: 'center',
                  flexDirection: 'row',
                  marginTop: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {onlineUsers.some(
                  user => user.userId === currentChatUser._id,
                ) ? (
                  <>
                    <View
                      style={{
                        borderRadius: 50,
                        height: 10,
                        width: 10,
                        backgroundColor: 'green',
                        marginRight: 5,
                      }}
                    />
                    <Text style={{color: 'black'}}>Online</Text>
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        borderRadius: 50,
                        height: 10,
                        width: 10,
                        backgroundColor: 'red',
                        marginRight: 5,
                      }}
                    />
                    <Text style={{color: 'black'}}>Offline</Text>
                  </>
                )}
              </View>
            </View>
          ),
          headerTitleStyle: {
            fontSize: 18,
          },
          headerTitleAlign: 'center',
          headerShown: true,
        });
      currentChat?.type === 'PUBLIC' &&
        navigation.setOptions({
          title: (
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 17,
                color: 'black',
              }}>
              {currentChat.name}
            </Text>
          ),
          headerTitleStyle: {
            fontSize: 18,
          },
          headerTitleAlign: 'center',
          headerShown: true,
        });
    }
  }, []);
  React.useEffect(() => {
    scrollRef.current?.scrollToEnd({animated: 'true'});
  }, [messages]);
  const readMessages = async () => {
    messages?.map(async m => {
      try {
        if (m?.read[account.user._id] === false) {
          axios.put(config.API_SERVER + 'messages/readMessages/' + m.roomId, {
            currentUserId: account.user._id,
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    });
  };

  useEffect(() => {
    if (currentChat) {
      readMessages();
    }
  }, [currentChat]);

  // const handleCallButton = (id) => {
  //     const data = {
  //         caller: account.user._id,
  //         receiver: id
  //     }
  //     navigation.navigate('Videos', {data, type: 'PRIVATE'})
  // }
  const [file, setFile] = React.useState('');
  const [selectedFiles, setSelectedFiles] = React.useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    if (newMessage === '' && commentFile === null) return;
    setSendIsLoading(true);
    const receiverId = currentChat.members.find(
      m => m.userId !== account.user._id,
    );
    const message = {
      roomId: currentChat._id,
      sender: account.user._id,
      text: newMessage,
      attachment: [],
      read: {
        [account.user._id]: true,
        [receiverId.userId]: false,
      },
    };
    if (commentFile !== null) {
      formData.append('file', {
        uri: commentFile.assets[0].uri,
        type: commentFile.assets[0].type,
        name: commentFile.assets[0].fileName,
      });
    }
    try {
      let success = true;
      if (commentFile !== null) {
        try {
          const response = await axios.post(
            config.API_SERVER + 'upload',
            formData,
            {headers: {'Content-Type': 'multipart/form-data'}},
          );
          message.attachment = [
            {
              displayName: commentFile.assets[0].fileName,
              actualName: response.data.upload,
            },
          ];
          success = true;
        } catch (error) {
          setSendIsLoading(false);
          console.log(error);
          success = false;
        }
      }
      if (success) {
        setSendIsLoading(true);
        const res = await axios.post(config.API_SERVER + 'messages', message);
        setMessages([...messages, res.data]);
        setNewMessage('');
        setMessageSent(true);
        setSendIsLoading(false);
        sendMessage(
          message.sender,
          receiverId.userId,
          newMessage,
          currentChat._id,
          message.attachment,
        );
        setCommentFile(null);
      }
    } catch (error) {
      setSendIsLoading(false);
      console.log(error);
    }
    setSelectedFiles([]);
    setFile('');
  };
  const options = {
    title: 'Select Image',
    type: 'library',
    options: {
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    },
  };

  const [commentFile, setCommentFile] = useState(null);
  const handleClick = async () => {
    try {
      const images = await launchImageLibrary(options);
      if (images.didCancel) {
        setCommentFile(null);
      } else {
        setCommentFile(images);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const removeItem = () => {
    // setSelectedFiles(prev => prev.filter(item => item.name !== val));
    setCommentFile(null);
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {currentChat &&
        currentChat.type === 'PUBLIC' &&
        account.user.role[0] !== 'USER' && (
          <View style={{marginBottom: 15}}>
            <GroupTools group={currentChat} />
          </View>
        )}
      {currentChat &&
        currentChat.type === 'PRIVATE' &&
        messagesLoading === false &&
        messages?.length === 0 && (
          <Text
            style={{
              position: 'absolute',
              left: '15%',
              top: '25%',
              fontWeight: 'bold',
            }}>
            You no conversation with this user, start now!
          </Text>
        )}
      {
        <>
          {currentChat ? (
            <ScrollView style={styles.messageArea} ref={scrollRef}>
              <ActivityIndicator
                size="large"
                style={{position: 'absolute', left: '45%'}}
                animating={messagesLoading}
              />
              {messages?.map((m, i) => (
                <Message
                  message={m}
                  own={m.sender === account.user._id}
                  type={currentChat.type}
                  key={i}
                  mk={i}
                />
              ))}
            </ScrollView>
          ) : null}
          {commentFile && (
            <View style={{width: 100, height: 100, position: 'relative'}}>
              <Image
                source={{uri: commentFile.assets[0].uri}}
                style={{width: 100, height: 100}}
              />
              <Pressable
                style={{position: 'absolute', left: 100}}
                onPress={removeItem}>
                <Image
                  source={require('../../assets/icons/cancel.png')}
                  style={{width: 20, height: 20}}
                />
              </Pressable>
            </View>
          )}

          <View style={styles.send}>
            {/* <KeyboardAwareScrollView style={styles.send}> */}
            <View style={styles.input}>
              <Reinput
                value={newMessage}
                fontSize={20}
                onChangeText={x => setNewMessage(x)}
                label="Send message"
              />
            </View>

            <TouchableOpacity text="send" onPress={handleSubmit}>
              <Image
                style={{
                  height: 30,
                  width: 30,
                  marginVertical: 20,
                  marginLeft: 10,
                }}
                source={require('../../assets/images/send.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity text="send" onPress={handleClick}>
              <Image
                style={{
                  height: 30,
                  width: 30,
                  marginLeft: 10,
                  marginVertical: 20,
                  // tintColor: 'tomato',
                }}
                source={require('../../assets/images/picture.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <ActivityIndicator
              style={{position: 'absolute', left: '45%'}}
              animating={sendIsLoading}
            />
            {/* </KeyboardAwareScrollView> */}
          </View>
        </>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  messageArea: {
    height: '100%',
    flex: 1,
    padding: 8,
  },
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  send: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
  },
  input: {
    width: '80%',
  },
  tools: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '10%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});

export default MessageScreen;
