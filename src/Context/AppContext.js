import axios from 'axios';
import React, {createContext, useState, useRef, useEffect} from 'react';
import {useSelector} from 'react-redux';
import config from '../config';
import {ActivityIndicator, Alert, View} from 'react-native';
import {io} from 'socket.io-client';
// import {useNavigation} from '@react-navigation/native';
// import {uuid} from 'uuidv4';
import {navigate} from './navRef';
const AppContext = createContext();

const ContextProvider = ({children}) => {
  const [rooms, setRooms] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  // const navigation = useNavigation();
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [id, setId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [existInRoom, setExistInRoom] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [appLoading, setAppLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [ROOM_ID, setROOM_ID] = useState('');

  const account = useSelector(s => s.account);
  const socket = io.connect(config.SOCKET_SERVER);
  const [callData, setCallData] = useState({caller: '', receiver: ''});

  const [callerId, setCallerId] = useState('');
  const [declineInfo, setDeclineInfo] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callDeclined, setCallDeclined] = useState(false);
  const [callerMsg, setCallerMsg] = useState('');
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [adminMessage, setAdminMessage] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);

  const [userGroups, setUserGroups] = useState([]);

  const [arrivalNotification, setArrivalNotification] = useState(null);

  useEffect(() => {
    // const LOGO = require('/public/uploads/profilePictures/'+account.user.profilePicture)
    if (account.token) {
      // setProfilePicture(LOGO)
      socket.emit('addUser', account?.user._id);
    }
  }, [account]);

  useEffect(() => {
    setAppLoading(false);
    return () => {
      setCurrentChatUser(null);
      setCurrentChat(null);
      setId(null);
    };
  }, []);

  const join = (ROOM_ID, type) => {
    history.push({
      pathname: `/videochat/${ROOM_ID}`,
      state: {allowed: true, callData, type},
    });
  };

  const handleCallButton = val => {
    // const uid = uuid();
    const uid = 'TE0ST5564644SCX5';
    socket.emit('callNotif', {
      caller: {
        fullName: `${account?.user.first_name} ${account?.user.last_name}`,
        id: account?.user._id,
      },
      id: val,
      room: uid,
    });
    setROOM_ID(uid);
  };
  const removeGroup = data => {
    data.members.map(async item => {
      if (account.user._id !== item) {
        socket.emit('sendNotification', {
          senderId: account.user._id,
          receiverId: item,
          content: `${data.name} has been removed!`,
        });
        // await sendNotification(account.user._id, item, `${data.name} has been removed!`)
      }
    });
    socket.emit('removeGroup', data);
  };
  React.useEffect(() => {
    socket.on('getUsers', users => {
      setOnlineUsers(users);
    });
    socket.on('getMessage', async data => {
      try {
        if (data.senderId === 'CHAT') {
          setAdminMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        }

        const res = await axios.get(
          config.API_SERVER + 'user/users/' + data.senderId,
        );
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
          currentChat: data.currentChat,
        });
        if (!currentChat) {
          Alert.alert(
            res.data.first_name + ' ' + res.data.last_name,
            data.text,
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Go', onPress: () => userHasRoom(res.data)},
            ],
          );
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('getNotification', async data => {
      console.log('got notif');
      try {
        const res = await axios.get(
          config.API_SERVER + 'user/users/' + data.senderId,
        );
        // openNotification('Group', {sender: `${res.data.first_name} ${res.data.last_name}`, text: data.content}, 'notif')
        setArrivalNotification({
          title: 'Group',
          sender: data.senderId,
          content: data.content,
          createdAt: Date.now(),
          read: false,
        });
      } catch (e) {
        console.log(e);
      }
    });

    socket.on('getCallerID', data => {
      setCallerId(data);
    });

    socket.on('notif', data => {
      console.log('receiving call');
      setCallerMsg(data.msg);
      setCallData(prev => ({...prev, receiver: data.caller}));
      setIsReceivingCall(true);
    });

    socket.on('callAccepted', (acceptName, status) => {
      setCallData(prev => ({...prev, receiver: acceptName.acceptName}));
      socket.on('getRoomID', data => setROOM_ID(data));
      setIsReceivingCall(false);
      setCallAccepted(true);
      navigate('Videos');
      console.log(acceptName + ' CALL ACCEPTED NAVIGATEEE');
    });

    socket.on('callDeclined', data => {
      console.log('call declined');
      setIsReceivingCall(false);
      setCallDeclined(true);
      setDeclineInfo(data.msg);
    });
  }, [socket]);

  const sendMessage = (senderId, receiverId, newMessage, currentChat) => {
    // sendMessageNotification(senderId, receiverId, newMessage)
    socket.emit('sendMessage', {
      senderId: senderId,
      receiverId,
      text: newMessage,
      currentChat,
    });
  };

  const submitAddMember = async (currentChat, addedMembers) => {
    try {
      try {
        const res = await axios.put(
          config.API_SERVER + 'rooms/addNewGroupMember/' + currentChat._id,
          {members: addedMembers._id},
        );
        socket.emit('sendNotification', {
          senderId: account.user._id,
          receiverId: addedMembers._id,
          content: `You have been added to the group ${res.data.name}!`,
        });
        //   await sendNotification(
        //     account.user._id,
        //     addedMembers._id,
        //     `You have been added to the group ${res.data.name}!`,
        //   );
        socket.emit('addToGroup', {currentChat, addedUser: addedMembers._id});
        try {
          const user = await axios.get(
            config.API_SERVER + 'user/users/' + addedMembers._id,
          );
          try {
            const data = {
              roomId: currentChat._id,
              sender: 'CHAT',
              text: `${user.data.first_name} ${user.data.last_name} has been added to the group!`,
            };
            const res = await axios.post(config.API_SERVER + 'messages', data);
            try {
              const room = await axios.get(
                config.API_SERVER + 'rooms/room/' + currentChat._id,
              );
              if (room.data.type === 'PUBLIC') {
                room.data.members.map(member => {
                  sendMessage('CHAT', member, res.data.text, currentChat._id);
                });
              }
              setAdminMessage(data);
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      } catch (e) {
        console.log(e.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitRemoveMember = async (currentChat, addedMembers) => {
    try {
      try {
        const res = await axios.put(
          config.API_SERVER +
            `rooms/removeGroupMember/${currentChat._id}/${addedMembers._id}`,
        );
        //   sendNotification(
        //     account.user._id,
        //     addedMembers._id,
        //     `You have been removed from the group ${res.data.name}!`,
        //   );
        socket.emit('sendNotification', {
          senderId: account.user._id,
          receiverId: addedMembers._id,
          content: `You have been removed from the group ${res.data.name}!`,
        });
        socket.emit('removeFromGroup', {
          currentChat,
          removedUser: addedMembers._id,
        });
        try {
          const user = await axios.get(
            config.API_SERVER + 'user/users/' + addedMembers._id,
          );
          const data = {
            roomId: currentChat._id,
            sender: 'CHAT',
            text: `${user.data.first_name} ${user.data.last_name} has been removed from the group!`,
          };
          try {
            const res = await axios.post(config.API_SERVER + 'messages', data);
            try {
              const room = await axios.get(
                config.API_SERVER + 'rooms/room/' + currentChat._id,
              );
              try {
                if (room.data.type === 'PUBLIC') {
                  room.data.members?.map(member => {
                    if (member !== account.user._id)
                      sendMessage(
                        'CHAT',
                        member,
                        res.data.text,
                        currentChat._id,
                      );
                  });
                }
                setAdminMessage(data);
              } catch (e) {
                console.log(e);
              }
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const userHasRoom = async user => {
    try {
      console.log(user);
      setId(user._id);
      setCurrentChatUser(user);
      const res = await axios.get(config.API_SERVER + 'rooms/' + user._id);
      if (res.data.length === 0) {
        console.log('No room found');
      }
      const resp = res.data.map(room => {
        if (
          room.members.includes(account.user._id) &&
          room.type === 'PRIVATE'
        ) {
          setCurrentChat(room);
          return true;
        } else {
          return false;
        }
      });

      if (resp.includes(true)) {
        setExistInRoom(true);
      } else {
        setExistInRoom(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const removeMessagesFromRoom = async roomId => {
    console.log('removing messages from: ' + roomId);
    try {
      await axios.delete(config.API_SERVER + 'rooms/removeMessages/' + roomId);
    } catch (error) {
      console.log(error);
    }
  };
  const createGroup = data => {
    console.log(data);
    socket.emit('createGroup', data);
    data.members.map(async item => {
      if (account.user._id !== item) {
        socket.emit('sendNotification', {
          senderId: account.user._id,
          receiverId: item,
          content: `You have been added to the new group ${data.name}!`,
        });
        // await sendNotification(account.user._id, item, `You have been added to the new group ${data.name}!`)
      }
    });
  };
  return (
    <AppContext.Provider
      value={{
        createGroup,
        ROOM_ID,
        onlineUsers,
        arrivalMessage,
        profilePicture,
        messages,
        messagesLoading,
        isChanged,
        setIsChanged,
        handleCallButton,
        submitAddMember,
        submitRemoveMember,
        sendMessage,
        setMessagesLoading,
        setMessages,
        userHasRoom,
        removeGroup,
        removeMessagesFromRoom,
        account,
        existInRoom,
        setExistInRoom,
        currentChatUser,
        setCurrentChatUser,
        currentChat,
        setCurrentChat,
        id,
        setId,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export {ContextProvider, AppContext};
