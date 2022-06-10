import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import CustomButton from '../../components/CustomButton';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';
import {LOGOUT} from '../../redux/actions';
import Room from '../Room';
import {Pressable} from 'react-native';
import Message from '../../components/Message';
import {useNavigation} from '@react-navigation/native';
import {format} from 'timeago.js';
import {Picker} from '@react-native-picker/picker';
import CustomInput from '../../components/CustomInput';
import moment from 'moment';
const ChatScreen = () => {
  const [rooms, setRooms] = useState([]);
  const navigation = useNavigation();
  const {
    id,
    setMessages,
    setMessagesLoading,
    setCurrentChat,
    currentChat,
    arrivalMessage,
    userHasRoom,
    existInRoom,
    account,
    isChanged,
    setIsChanged,
    createGroup,
    messageSent,
    setMessageSent,
  } = useContext(AppContext);

  const dispatcher = useDispatch();

  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const u = await axios.get(config.API_SERVER + 'user/users');
      setUsers(u.data);
    } catch (error) {
      console.log(error);
    }
  };
  async function getRooms() {
    try {
      const res = await axios.get(
        config.API_SERVER + 'rooms/' + account.user._id,
      );
      console.log(res.data);
      setRooms(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    setRooms([]);

    getRooms();
    setPrivateRooms([]);

    getPrivateRooms();
    setMessageSent(false);
  }, [account, arrivalMessage]);
  useEffect(() => {
    if (messageSent) {
      setRooms([]);
      getRooms();
      setPrivateRooms([]);
      getPrivateRooms();
      setMessageSent(false);
    }
  }, [messageSent]);
  const [refreshing, setRefreshing] = useState(false);
  const refreshChat = () => {
    setRefreshing(true);
    setRooms([]);
    getRooms();
    setPrivateRooms([]);
    getPrivateRooms();
    setRefreshing(false);
  };
  useEffect(() => {
    // setPrivateRooms([]);
    getPrivateRooms();
  }, [arrivalMessage]);
  useEffect(() => {
    const createUser = async () => {
      if (existInRoom === false) {
        try {
          console.log('Room is about to be created...');
          const members = {
            senderId: account.user._id,
            receiverId: id,
          };

          await axios.post(config.API_SERVER + 'rooms', members);
          getPrivateRooms();
          try {
            const res = await axios.get(config.API_SERVER + 'user/users/' + id);
            userHasRoom(res.data);
          } catch (error) {
            console.log(error);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    createUser();
  }, [existInRoom]);

  const getMessages = async () => {
    try {
      setMessagesLoading(true);
      const res = await axios.get(
        config.API_SERVER + 'messages/' + currentChat?._id,
      );
      setMessages(res.data);
      setMessagesLoading(false);
    } catch (error) {
      setMessagesLoading(false);
      console.log(error.message);
    }
  };
  useEffect(() => {
    if (currentChat) {
      getMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    if (currentChat) {
      navigation.navigate('Messages');
    }
  }, [currentChat]);

  useEffect(() => {
    getPrivateRooms();

    // getLastRoomMessage();
  }, []);
  useEffect(() => {
    getPrivateRooms();
    getUnreadRoomMessages();
    // getLastRoomMessage();
  }, [rooms]);
  useEffect(() => {
    console.log('roomCounTTTTTTTTTTTTTTTTTTTTt');
    console.log(roomCount);
  }, [roomCount]);
  const [roomCount, setRoomCount] = useState([]);
  const getUnreadRoomMessages = async () => {
    rooms?.map(async room => {
      try {
        let cp = 0;
        const messages = await axios.get(
          config.API_SERVER + 'messages/' + room._id,
        );
        for (let i = 0; i < messages.data.length; i++) {
          cp++;
        }
        setRoomCount(prev => [...prev, {room: room._id, count: cp}]);
      } catch (err) {
        console.log(err);
      }
    });
  };
  const [privateRooms, setPrivateRooms] = useState([]);
  const [privateRoomsLoading, setPrivateRoomsLoading] = useState(false);
  const getPrivateRooms = () => {
    rooms?.map(async item => {
      if (item.type === 'PRIVATE') {
        item.members.map(async m => {
          if (m.userId !== account.user._id) {
            if (privateRooms?.some(user => user.user?._id !== m.userId)) return;
            try {
              setPrivateRoomsLoading(true);
              const res = await axios.get(
                config.API_SERVER + 'user/users/' + m.userId,
              );

              if (
                privateRooms?.some(user => user.user._id === res.data._id) ===
                false
              ) {
                console.warn('doesnt exist');
                setPrivateRoomsLoading(true);
                try {
                  const t = await axios.get(
                    config.API_SERVER + 'messages/lastMessage/' + item._id,
                  );

                  setPrivateRooms(prev => [
                    ...prev,
                    {
                      user: res.data,
                      lastMessage: t.data,
                      type: item.type,
                      room: item,
                    },
                  ]);
                } catch (error) {
                  console.log(error);
                }

                setPrivateRoomsLoading(false);
              }
              setPrivateRoomsLoading(false);
            } catch (e) {
              setPrivateRoomsLoading(false);
              console.log(e);
            }
          }
        });
      }
      if (item.type === 'PUBLIC') {
        if (privateRooms?.some(user => user.room._id !== item._id)) return;
        try {
          setPrivateRoomsLoading(true);
          if (
            privateRooms?.some(user => user.room._id === item._id) === false
          ) {
            console.warn('doesnt exist');
            setPrivateRoomsLoading(true);

            const t = await axios.get(
              config.API_SERVER + 'messages/lastMessage/' + item._id,
            );
            setPrivateRooms(prev => [
              ...prev,
              {
                lastMessage: t.data,
                type: item.type,
                room: item,
              },
            ]);
          }
          setPrivateRoomsLoading(false);
        } catch (e) {
          setPrivateRoomsLoading(false);
          console.log(e);
        }
      }
    });
  };
  useEffect(() => {
    if (isChanged) {
      setPrivateRooms([]);
      setRooms([]);
      getRooms();
      getPrivateRooms();
      setIsChanged(false);
    }
  }, [isChanged]);
  const [lastMessage, setLastMessage] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({
    receiver: '',
    count: 0,
  });

  // const getLastRoomMessage = async () => {
  //   try {
  //     setPrivateRoomsLoading(true);
  //     rooms?.map(async room => {
  //       if (room.members.some(u => u.userId === account.user._id)) {
  //         try {
  //           room.members.map(async item => {
  //             if (item.userId !== account.user._id) {
  //               const getlastMessage = await axios.get(
  //                 config.API_SERVER + 'messages/lastMessage/' + room._id,
  //               );

  //               !lastMessage.filter(e => e.room._id === room._id).length > 0 &&
  //                 setLastMessage(prev => [
  //                   ...prev,
  //                   {
  //                     room: room,
  //                     receiver: item.userId,
  //                     message: getlastMessage.data,
  //                   },
  //                 ]);

  //               try {
  //                 const messages = await axios.get(
  //                   config.API_SERVER + 'messages/' + room._id,
  //                 );
  //                 messages.data.map(message => {
  //                   if (message.read === false) {
  //                     setUnreadMessages({
  //                       receiver: item.userId,
  //                       count: unreadMessages.count + 1,
  //                     });
  //                   }
  //                 });
  //               } catch (err) {
  //                 console.log(err);
  //               }
  //             }
  //           });
  //         } catch (error) {
  //           console.log(error);
  //         }
  //       }
  //     });
  //     setPrivateRoomsLoading(false);
  //   } catch (error) {
  //     setPrivateRoomsLoading(false);
  //     console.log(error);
  //   }
  // };
  // const handleRoomClick = (user) => {
  //     console.log(user);
  // }

  const PrivateRooms = () => {
    return privateRooms?.map((item, index) => {
      return (
        <>
          <View
            key={index}
            style={{
              width: '94%',
              alignSelf: 'center',
              backgroundColor: 'rgba(0,0,0,0.2)',
              height: 1,
              marginTop: 5,
            }}
          />

          {item.room.type === 'PRIVATE' && (
            <TouchableOpacity
              style={styles.convContainer}
              onPress={() => userHasRoom(item.user)}>
              <Image
                style={styles.convImage}
                resizeMode="contain"
                source={
                  item.user.profilePicture
                    ? {
                        uri: config.CONTENT + item.user.profilePicture,
                      }
                    : require('../../assets/images/user.png')
                }
              />
              <SafeAreaView style={styles.convMiddleSection}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    color: 'black',
                    fontSize: 15,
                  }}>
                  {item.user.first_name + ' ' + item.user.last_name}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    color: 'rgba(0,0,0,0.6)',
                    paddingTop: 5,
                  }}>
                  {item.lastMessage?.text !== '' && item.lastMessage?.text}

                  {item.lastMessage?.attachment?.length > 0 &&
                    item.user.first_name + ' has sent an attachment!'}

                  {!item.lastMessage && 'No messages'}
                </Text>
              </SafeAreaView>
              <SafeAreaView style={styles.convEndSection}>
                <Text
                  style={{fontFamily: 'Montserrat-Regular', color: 'black'}}>
                  {item.lastMessage?.createdAt
                    ? format(item.lastMessage?.createdAt)
                    : '---'}
                </Text>
                <Text style={styles.convMessageCount}>0</Text>
              </SafeAreaView>
            </TouchableOpacity>
          )}
          {item.type === 'PUBLIC' && (
            <TouchableOpacity
              style={styles.convContainer}
              onPress={() => setCurrentChat(item.group)}>
              <Image
                style={styles.convImage}
                source={require('../../assets/images/group.png')}
                resizeMode="contain"
              />

              <SafeAreaView style={styles.convMiddleSection}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    color: 'black',
                    fontSize: 15,
                  }}>
                  {item.room.name}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    color: 'rgba(0,0,0,0.6)',
                    paddingTop: 5,
                  }}>
                  {item.lastMessage?.text
                    ? item.lastMessage?.text
                    : 'No messages'}
                </Text>
              </SafeAreaView>
              <SafeAreaView style={styles.convEndSection}>
                <Text
                  style={{fontFamily: 'Montserrat-Regular', color: 'black'}}>
                  {item.lastMessage?.createdAt
                    ? format(item.lastMessage?.createdAt)
                    : null}
                </Text>
                <Text style={styles.convMessageCount}>
                  {roomCount?.map(cc => {
                    if (cc.room == item._id) {
                      return cc.count;
                    }
                  })}
                </Text>
              </SafeAreaView>
            </TouchableOpacity>
          )}
        </>
      );
    });
  };
  const handleCreate = () => {
    console.log('create');
    getUsers();
    setShow(true);
  };
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const submitCreateGroup = async () => {
    let data = {
      name: groupName,
      type: 'PUBLIC',
      members: [],
    };
    selectedUsers.map(m => {
      data.members.push({userId: m._id, joinedIn: moment().toISOString()});
    });

    if (account.user.role[0] !== 'USER') {
      data.members.push({
        userId: account.user._id,
        joinedIn: moment().toISOString(),
      });
    }
    console.log(groupName);
    try {
      const res = await axios.post(config.API_SERVER + 'rooms/newGroup', data);
      createGroup(res.data);
      setIsChanged(true);
      setGroupName('');
      setSelectedUsers([]);
      setStatus(1);
      setShow(false);
    } catch (e) {
      console.log(e);
    }
  };
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const clean = () => {
    setGroupName('');
    setSelectedUsers([]);
    setShow(false);
  };
  const handlePickerChange = (val, index) => {
    console.log(val);
    if (!val) return;
    if (selectedUsers.length > 0) {
      selectedUsers?.map(item => {
        console.log(item._id + '   ' + val._id);
        if (item._id !== val._id) {
          console.log('PUSH DOESNT EXIST');
          setSelectedUsers(prev => [...prev, val]);
        }
      });
    }
    if (selectedUsers.length === 0) {
      setSelectedUsers([val]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Room />
      </View>
      <View style={styles.content}>
        {privateRoomsLoading && <ActivityIndicator size="large" />}
        <View style={styles.buttonContainer} key="1F">
          {privateRoomsLoading === false && (
            <TouchableOpacity style={styles.button} onPress={handleCreate}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                Create group!
              </Text>
            </TouchableOpacity>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={show}
            onRequestClose={() => {
              setShow(false);
            }}>
            <View style={styles.overlay}>
              <View style={styles.modalContent}>
                <ScrollView style={{height: 10}}>
                  {selectedUsers?.map(item => (
                    <Text style={{color: 'white'}}>
                      {item?.first_name} {item?.last_name}
                    </Text>
                  ))}
                </ScrollView>

                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Group name"
                    placeholderTextColor="rgba(0,0,0,0.5)"
                    value={groupName}
                    onChangeText={setGroupName}
                  />
                </View>
                <Picker
                  style={styles.picker}
                  placeholder="select group"
                  placeholderTextColor="black"
                  selectedValue={selectedUser}
                  onValueChange={(val, index) => {
                    if (!val) {
                      return;
                    }
                    setSelectedUsers(prev => [...prev, val]);
                    setSelectedUser(val);
                  }}>
                  <Picker.Item label="Select a value..." value="" />
                  {users
                    ?.filter(user => user._id !== account.user._id)
                    .map(item => {
                      // if (groupMembers.some(m => m._id !== item._id)) {
                      return (
                        <Picker.Item
                          style={{color: 'black'}}
                          label={item.first_name + ' ' + item.last_name}
                          value={item}
                        />
                      );
                      // }
                    })}
                </Picker>
                <View style={{width: '50%', margin: 5}}>
                  <CustomButton text="Confirm" onPress={submitCreateGroup} />
                </View>
                <Pressable style={{margin: 5}} onPress={clean}>
                  <Text style={{color: 'white'}}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshChat} />
          }>
          {PrivateRooms()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  overlay: {
    borderRadius: 15,
    marginTop: '50%',
    margin: 10,
    flex: 0.7,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    height: 50,
    flexDirection: 'column',
    // backgroundColor: 'white',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: '26%',
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    width: 275,
    margin: 10,
  },
  content: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  allChat: {
    alignSelf: 'flex-start',
    padding: 10,
    fontSize: 20,
    fontFamily: 'Montserrat-Medium',
  },

  convContainer: {
    backgroundColor: 'white',
    padding: 5,
    minHeight: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    width: '95%',
    borderRadius: 5,
    fontFamily: 'Montserrat-Regular',
    // borderBottomWidth: 2,
    // borderTopWidth: 2,
    // borderColor: 'rgba(0,0,0,0.1)',
  },
  convImage: {
    width: 50,
    height: 50,
    borderRadius: 150,
    flexBasis: '14%',
  },
  convMiddleSection: {
    marginLeft: 10,
    flexDirection: 'column',
    flexBasis: '50%',
  },
  convEndSection: {
    marginLeft: 20,
    flexDirection: 'column',
    justifyContent: 'space-around',
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
  },
  buttonContainer: {
    display: 'flex',

    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 50,
    backgroundColor: 'lightblue',
  },
  picker: {
    height: 50,
    width: '70%',
    backgroundColor: 'white',
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    borderRadius: 10,
  },
});

export default ChatScreen;
