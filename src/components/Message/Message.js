import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import {AppContext} from '../../Context/AppContext';
import {format} from 'timeago.js';
import config from '../../config';
import axios from 'axios';
const Message = ({message, own, type}) => {
  const {currentChat} = useContext(AppContext);
  //   message.attachment && console.log(message.attachment[0]);
  const [user, setUser] = useState({});
  const getUser = async () => {
    if (message.sender === 'CHAT') return;
    try {
      const res = await axios.get(
        config.API_SERVER + 'user/users/' + message.sender,
      );
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, [message]);
  // useEffect(() => {
  //   user && console.log(user);
  // }, [user]);
  // useEffect(() => {
  //   console.log(message.sender);
  // }, [message]);
  const [visible, setVisible] = useState(false);
  const previewImage = () => {
    setVisible(!visible);
  };
  return (
    <>
      <View
        key={message._id}
        style={[
          own ? styles.ownMessageContainer : styles.freindMessageContainer,
          message.sender === 'CHAT' && styles.bot,
        ]}>
        {type === 'PUBLIC' && message.sender !== 'CHAT' && (
          <Text
            style={
              own
                ? {fontSize: 16, color: 'white'}
                : {fontSize: 16, color: 'black'}
            }>
            {user.first_name} {user.last_name}
          </Text>
        )}
        <Text
          style={[
            own ? styles.text : [styles.text, {color: 'black'}],
            message.sender === 'CHAT' && {color: 'white'},
          ]}>
          {message.text}
        </Text>

        {message?.attachment.length > 0 && (
          <>
            <TouchableOpacity onPress={previewImage}>
              <Image
                resizeMode="stretch"
                source={{
                  uri: config.CONTENT + message.attachment[0].actualName,
                }}
                style={{flex: 1, height: 100, width: '100%'}}
              />
            </TouchableOpacity>
            <Modal
              animationType={'fade'}
              transparent={true}
              onRequestClose={() => setVisible(false)}
              visible={visible}>
              <View style={styles.overlay}>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Image
                    resizeMode="stretch"
                    source={{
                      uri: config.CONTENT + message.attachment[0].actualName,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </Modal>
          </>
        )}
      </View>
      <Text
        style={[
          own
            ? {alignSelf: 'flex-end', marginRight: 5}
            : {alignSelf: 'flex-start'},
          styles.date,
        ]}>
        {format(message.createdAt)}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  freindMessageContainer: {
    justifyContent: 'center',
    width: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 13,
    margin: 3,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginTop: 5,
    elevation: 0.5,
  },
  ownMessageContainer: {
    justifyContent: 'center',
    width: '40%',
    backgroundColor: '#ff3f5b',
    padding: 13,
    margin: 3,
    borderRadius: 7,
    alignSelf: 'flex-end',
    marginTop: 5,
    elevation: 1,
  },
  text: {
    color: 'white',
    fontFamily: 'Montserrat-Medium',
  },
  date: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 13,
    color: 'rgba(0,0,0,0.4)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
});

export default Message;
