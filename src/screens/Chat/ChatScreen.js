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
  } = useContext(AppContext);

  const dispatcher = useDispatch();

  // const imageURL = `../../../public/uploads/profilePictures/${account.user.profilePicture}`

  useEffect(() => {
    async function getRooms() {
      try {
        const res = await axios.get(
          config.API_SERVER + 'rooms/' + account.user._id,
        );
        setRooms(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getRooms();
  }, [account]);
  useEffect(() => {
    getLastRoomMessage();
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
    getLastRoomMessage();
  }, [rooms]);

  const [privateRooms, setPrivateRooms] = useState([]);
  const [privateRoomsLoading, setPrivateRoomsLoading] = useState(false);
  const getPrivateRooms = () => {
    rooms?.map(item => {
      if (item.type === 'PRIVATE') {
        item.members.map(async m => {
          if (m !== account.user._id) {
            if (privateRooms?.some(user => user._id !== m)) return;
            try {
              setPrivateRoomsLoading(true);
              const res = await axios.get(
                config.API_SERVER + 'user/users/' + m,
              );

              if (
                privateRooms?.some(user => user._id === res.data._id) === false
              ) {
                console.warn('doesnt exist');
                try {
                  const t = await axios.get(
                    config.API_SERVER + 'messages/lastMessage/' + item._id,
                  );
                  setPrivateRooms(prev => [
                    ...prev,
                    {user: res.data, lastMessage: t.data.last_message},
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
    });
  };
  const [lastMessage, setLastMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState({
    receiver: '',
    count: 0,
  });

  const getLastRoomMessage = async () => {
    try {
      setPrivateRoomsLoading(true);
      rooms?.map(async room => {
        if (
          room.members.includes(account.user._id) &&
          room.type === 'PRIVATE'
        ) {
          try {
            room.members.map(async item => {
              if (item !== account.user._id) {
                const lastMessage = await axios.get(
                  config.API_SERVER + 'messages/lastMessage/' + room._id,
                );
                setLastMessage({receiver: item, message: lastMessage.data});
                try {
                  const messages = await axios.get(
                    config.API_SERVER + 'messages/' + room._id,
                  );
                  messages.data.map(message => {
                    if (message.read === false) {
                      setUnreadMessages({
                        receiver: item,
                        count: unreadMessages.count + 1,
                      });
                    }
                  });
                } catch (err) {
                  console.log(err);
                }
              }
            });
          } catch (error) {
            console.log(error);
          }
        }
      });
      setPrivateRoomsLoading(false);
    } catch (error) {
      setPrivateRoomsLoading(false);
      console.log(error);
    }
  };
  // const handleRoomClick = (user) => {
  //     console.log(user);
  // }
  const PrivateRooms = () => {
    return privateRooms?.map(item => (
      <>
        <View
          key={item.user._id}
          style={{
            width: '94%',
            alignSelf: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
            height: 2,
            marginTop: 5,
          }}
        />
        <TouchableOpacity
          style={styles.convContainer}
          onPress={() => userHasRoom(item.user)}>
          <Image
            style={styles.convImage}
            resizeMode="contain"
            source={{
              uri: config.CONTENT + item.user.profilePicture,
            }}
          />
          <SafeAreaView style={styles.convMiddleSection}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                color: 'black',
                fontSize: 15,
              }}>
              {item.user.first_name} {item.user.last_name}
            </Text>
            <Text style={{fontFamily: 'Montserrat-Medium', paddingTop: 5}}>
              {item.user._id === lastMessage.receiver &&
                lastMessage.message?.text}
            </Text>
          </SafeAreaView>
          <SafeAreaView style={styles.convEndSection}>
            <Text style={{fontFamily: 'Montserrat-Regular'}}>
              {format(lastMessage.message?.createdAt)}
            </Text>
            <Text style={styles.convMessageCount}>
              {item.user._id === unreadMessages.receiver
                ? unreadMessages.count
                : 0}
            </Text>
          </SafeAreaView>
        </TouchableOpacity>
      </>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Room />
      </View>
      <View style={styles.content}>
        {privateRoomsLoading && <ActivityIndicator size="large" />}
        <ScrollView>{PrivateRooms()}</ScrollView>
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

  header: {
    width: '100%',
    height: '26%',
    padding: 10,
    backgroundColor: 'white',
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
    padding: 15,
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
});

export default ChatScreen;
