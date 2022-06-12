import axios from 'axios';
import React, {createContext, useState, useRef, useEffect} from 'react';
import {useSelector} from 'react-redux';
import config from '../config';
import {ActivityIndicator, Alert, View} from 'react-native';
import {io} from 'socket.io-client';
// import {useNavigation} from '@react-navigation/native';
// import {uuid} from 'uuidv4';
import {navigate, navigationRef} from './navRef';
// import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
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
  const [notificationsCount, setNotificationsCount] = useState(0);
  const account = useSelector(s => s.account);
  const socket = io.connect(config.SOCKET_SERVER);
  const [callData, setCallData] = useState({caller: '', receiver: ''});

  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [adminMessage, setAdminMessage] = useState(null);

  const [arrivalNotification, setArrivalNotification] = useState(null);

  useEffect(() => {
    // const LOGO = require('/public/uploads/profilePictures/'+account.user.profilePicture)
    if (account.token !== '') {
      // setProfilePicture(LOGO)
      socket.emit('addUser', {userId: account.user._id, user: account.user});
    }
  }, [account.user]);

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
  const sendNotification = async (sender, to, message) => {
    try {
      const data = {
        title: 'Group',
        userId: to,
        sender: sender,
        content: message,
      };
      await axios.post(config.API_SERVER + 'notifications', data);
    } catch (error) {
      console.log(error);
    }
  };
  const exitGroup = async (currentChat, user) => {
    try {
      try {
        await axios.put(
          config.API_SERVER +
            `rooms/removeGroupMember/${currentChat._id}/${user._id}`,
        );

        try {
          const data = {
            roomId: currentChat._id,
            sender: 'CHAT',
            text: `${user.first_name} ${user.last_name} has exited the group!`,
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
                    if (member.userId !== account.user._id)
                      sendMessage(
                        'CHAT',
                        member.userId,
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
          window.location.reload();
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
  const removeGroup = data => {
    console.log(data);

    data.members.map(async item => {
      if (account.user._id !== item.userId) {
        socket.emit('sendNotification', {
          senderId: account.user._id,
          receiverId: item.userId,
          content: `${data.name} has been removed!`,
        });
        await sendNotification(
          account.user._id,
          item.userId,
          `${data.name} has been removed!`,
        );
      }
    });
    socket.emit('removeGroup', data);
  };
  // const navigation = useNavigation();
  const [messageSent, setMessageSent] = useState(false);
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
            currentChat: data.currentChat,
          });
        } else {
          try {
            // const res = await axios.get(
            //   config.API_SERVER + 'user/users/' + data.senderId,
            // );
            setArrivalMessage({
              sender: data.senderId,
              text: data.text,
              createdAt: Date.now(),
              currentChat: data.currentChat,
              attachment: data.attachement,
            });

            setNotificationsCount(notificationsCount + 1);
            // if (currentChat === null) {
            //   Alert.alert(
            //     res.data.first_name + ' ' + res.data.last_name,
            //     data.text,
            //     [
            //       {
            //         text: 'Ok',
            //         onPress: () => console.log('Cancel Pressed'),
            //         style: 'cancel',
            //       },
            //       // {
            //       //   text: 'Go',
            //       //   onPress: () => {
            //       //     navigation.navigate({routeName: '/Chats'});
            //       //     userHasRoom(res.data);
            //       //   },
            //       // },
            //     ],
            //   );
            // }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (e) {
        console.log(e);
      }
    });

    socket.on('getNotification', async data => {
      console.log('got notif');
      try {
        // const res = await axios.get(
        //   config.API_SERVER + 'user/users/' + data.senderId,
        // );
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

    socket.on('newPost', data => {
      if (account.user._id !== data.senderId) {
        setNewPost(data.content);
        saveNotificationToDB({
          actor: data.senderId,
          content: data.content,
        });
        setArrivalNotification({
          title: 'New post',
          sender: data.senderId,
          content: data.content,
          createdAt: Date.now(),
          read: false,
        });
      }

      // saveNotificationToDB({
      //     actor: account.user.first_name + ' ' + account.user.last_name,
      //     content: `${account.user.first_name} ${account.user.last_name} liked your post`
      // });
    });
    socket.on('newLike', data => {
      if (account.user._id !== data.senderId) {
        // openNotification('New like', data.content, 'notif');
        setNewLike({userId: data.senderId, postId: data.postId});

        setArrivalNotification({
          title: 'New like',
          sender: data.senderId,
          content: data.content,
          createdAt: Date.now(),
          read: false,
        });
      }
    });
    socket.on('newUnlike', data => {
      if (account.user._id !== data.senderId) {
        setNewUnlike({userId: data.senderId, postId: data.postId});
      }
    });
    socket.on('newComment', data => {
      if (account.user._id !== data.senderId) {
        setNewComment({comment: data.comment});
        // openNotification('New comment', data.comment.content, 'notif');
        setArrivalNotification({
          title: 'New Comment',
          sender: data.senderId,
          content: data.comment.content,
          createdAt: Date.now(),
          read: false,
        });
      }
    });
  }, [socket]);

  const [newPost, setNewPost] = React.useState(false);
  const [newLike, setNewLike] = React.useState(null);
  const [newUnlike, setNewUnlike] = React.useState(null);
  const [newComment, setNewComment] = React.useState(null);
  const emitNewPost = async (uid, priority) => {
    // sendNotification(account.user._id, m._id, `You have been removed from the group ${res.data.name}!`);
    try {
      const u = await axios.get(config.API_SERVER + 'user/users/' + uid);
      socket.emit('newPost', {
        senderId: account.user._id,
        content: `${u.data.first_name} ${u.data.last_name} uploaded a new ${
          priority ? 'announcement' : 'post'
        }!`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const emitNewComment = async (senderId, receiverId, comment) => {
    // sendNotification(account.user._id, m._id, `You have been removed from the group ${res.data.name}!`);
    try {
      socket.emit('newComment', {
        senderId,
        receiverId: receiverId,
        comment: comment,
      });
      // saveNotificationToDB({
      //     actor: account.user._id,
      //     content: `${u.data.first_name} ${u.data.last_name} uploaded a new ${priority ? 'announcement' : 'post'}!`
      // });
    } catch (error) {
      console.log(error);
    }
  };
  const emitNewUnlike = async (senderId, receiverId, postId) => {
    // sendNotification(account.user._id, m._id, `You have been removed from the group ${res.data.name}!`);
    try {
      socket.emit('newUnlike', {
        senderId,
        receiverId: receiverId,
        postId: postId,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const emitNewLike = async (senderId, receiverId, postId) => {
    // sendNotification(account.user._id, m._id, `You have been removed from the group ${res.data.name}!`);
    try {
      // const u = await axios.get(config.API_SERVER + 'user/users/' + uid);
      socket.emit('newLike', {
        senderId,
        receiverId: receiverId,
        postId: postId,
        content: `${account.user.first_name} ${account.user.last_name} liked your post!`,
      });
      saveNotificationToDB({
        actor: senderId,
        content: `${account.user.first_name} ${account.user.last_name} liked your post!`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const saveNotificationToDB = async props => {
    try {
      const u = await axios.get(
        config.API_SERVER + 'user/users/' + props.actor,
      );
      try {
        const data = {
          title: u.data.first_name + ' ' + u.data.last_name,
          content: props.content,
        };
        await axios.post(config.API_SERVER + 'notifications', data);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const sendMessageNotification = async (sender, to, message) => {
    try {
      const u = await axios.get(config.API_SERVER + 'user/users/' + sender);
      try {
        const data = {
          title: u.data.first_name + ' ' + u.data.last_name,
          userId: to,
          sender: sender,
          content: message,
        };
        const res = await axios.post(config.API_SERVER + 'notifications', data);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const sendMessage = async (
    senderId,
    receiverId,
    newMessage,
    currentChat,
    attachement = [],
  ) => {
    try {
      if (senderId !== 'CHAT') {
        const user = await axios.get(
          config.API_SERVER + 'user/users/' + senderId,
        );
        const text = newMessage
          ? newMessage
          : `${user.data.first_name} ${user.data.last_name} has sent an attachment!`;
        sendMessageNotification(senderId, receiverId, text);
        socket.emit('sendMessage', {
          senderId: senderId,
          receiverId,
          text: text,
          attachement,
          currentChat,
        });
      } else {
        sendMessageNotification(senderId, receiverId, newMessage);
        socket.emit('sendMessage', {
          senderId: senderId,
          receiverId,
          text: newMessage,
          attachement,
          currentChat,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const submitAddMember = async (currentChat, addedMembers) => {
    try {
      addedMembers?.map(async m => {
        try {
          await axios.put(
            config.API_SERVER + 'rooms/addNewGroupMember/' + currentChat._id,
            {
              members: {
                userId: m._id,
                joinedIn: moment().toISOString(),
                leftIn: '',
              },
            },
          );
          socket.emit('sendNotification', {
            senderId: account.user._id,
            receiverId: m._id,
            content: `You have been added to the group ${currentChat.name}!`,
          });
          await sendNotification(
            account.user._id,
            m._id,
            `You have been added to the group ${currentChat.name}!`,
          );
          socket.emit('addToGroup', {currentChat, addedUser: m._id});
          setCurrentChat(prev => ({
            ...prev,
            members: [
              ...prev.members,
              {userId: m._id, joinedIn: moment().toISOString(), leftIn: ''},
            ],
          }));
          try {
            const user = await axios.get(
              config.API_SERVER + 'user/users/' + m._id,
            );
            try {
              const data = {
                roomId: currentChat._id,
                sender: 'CHAT',
                text: `${user.data.first_name} ${user.data.last_name} has been added to the group!`,
              };
              const res = await axios.post(
                config.API_SERVER + 'messages',
                data,
              );
              try {
                const room = await axios.get(
                  config.API_SERVER + 'rooms/room/' + currentChat._id,
                );
                if (room.data.type === 'PUBLIC') {
                  room.data.members.map(member => {
                    sendMessage(
                      'CHAT',
                      member.userId,
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
          console.log(e.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const submitRemoveMember = (currentChat, addedMembers) => {
    try {
      addedMembers?.map(async m => {
        try {
          const res = await axios.put(
            config.API_SERVER +
              `rooms/removeGroupMember/${currentChat._id}/${m._id}`,
          );
          sendNotification(
            account.user._id,
            m._id,
            `You have been removed from the group ${res.data.name}!`,
          );
          socket.emit('sendNotification', {
            senderId: account.user._id,
            receiverId: m._id,
            content: `You have been removed from the group ${res.data.name}!`,
          });
          socket.emit('removeFromGroup', {currentChat, removedUser: m._id});
          const members = currentChat.members.filter(u => {
            return u.userId.includes(m._id) === false;
          });
          setCurrentChat(prev => ({...prev, members: members}));
          try {
            const user = await axios.get(
              config.API_SERVER + 'user/users/' + m._id,
            );
            const data = {
              roomId: currentChat._id,
              sender: 'CHAT',
              text: `${user.data.first_name} ${user.data.last_name} has been removed from the group!`,
            };
            try {
              const res = await axios.post(
                config.API_SERVER + 'messages',
                data,
              );
              try {
                const room = await axios.get(
                  config.API_SERVER + 'rooms/room/' + currentChat._id,
                );
                try {
                  if (room.data.type === 'PUBLIC') {
                    room.data.members?.map(member => {
                      sendMessage(
                        'CHAT',
                        member.userId,
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
      });
    } catch (error) {
      console.log(error);
    }
  };

  const userHasRoom = async user => {
    try {
      // console.log(user);
      setId(user._id);
      setCurrentChatUser(user);
      const res = await axios.get(config.API_SERVER + 'rooms/' + user._id);
      if (res.data.length === 0) {
        console.log('No room found');
      }
      const resp = res.data.map(room => {
        if (
          room.type === 'PRIVATE' &&
          room.members.some(u => u.userId === account.user._id)
        ) {
          console.log('set chat');
          console.log(room);
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
    if (data.name === '') return;
    socket.emit('createGroup', data);
    data.members.map(async item => {
      if (account.user._id !== item.userId) {
        socket.emit('sendNotification', {
          senderId: account.user._id,
          receiverId: item.userId,
          content: `You have been added to the new group ${data.name}!`,
        });
        await sendNotification(
          account.user._id,
          item.userId,
          `You have been added to the new group ${data.name}!`,
        );
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
        adminMessage,
        messages,
        messagesLoading,
        isChanged,
        messageSent,
        notificationsCount,
        newPost,
        setNewPost,
        newLike,
        setNewLike,
        newUnlike,
        setNewUnlike,
        newComment,
        setNewComment,
        setNotificationsCount,
        emitNewComment,
        setMessageSent,
        setIsChanged,
        handleCallButton,
        submitAddMember,
        exitGroup,
        submitRemoveMember,
        sendMessage,
        setMessagesLoading,
        setMessages,
        userHasRoom,
        removeGroup,
        removeMessagesFromRoom,
        emitNewUnlike,
        emitNewPost,
        emitNewLike,
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
