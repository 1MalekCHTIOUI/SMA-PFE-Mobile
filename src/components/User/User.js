import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';
// import DUMMY from '../../../public/uploads/profilePictures/camp.png'
const User = ({user, online}) => {
  const [data, setData] = useState(null);
  const [l, setL] = useState(false);
  const {userHasRoom} = useContext(AppContext);

  useEffect(() => {
    const getUser = async () => {
      try {
        setL(true);
        const res = await axios.get(config.API_SERVER + 'user/users/' + user);
        setData(res.data);
        setL(false);
      } catch (error) {
        setL(false);
        console.log(error);
      }
    };
    getUser();
    return () => setData(null);
  }, []);

  return (
    <Pressable
      style={styles.item}
      key={user._id}
      onPress={() => userHasRoom(data)}>
      {l ? (
        <ActivityIndicator size="large" />
      ) : (
        <View key={user._id} style={{position: 'relative'}}>
          <View>
            <Image
              resizeMode="contain"
              source={{uri: config.CONTENT + data?.profilePicture}}
              style={styles.circleborder}
            />
          </View>
          <Text style={styles.itemText}>{data?.first_name}</Text>
          <View
            style={
              online
                ? [styles.dot, {backgroundColor: '#1dc249'}]
                : [styles.dot, {backgroundColor: 'red'}]
            }></View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    marginLeft: 15,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
    color: 'white',
  },
  circleborder: {
    overflow: 'hidden',
    borderWidth: 2,
    width: 70,
    height: 70,
    borderRadius: 150,
    borderColor: 'white',
  },
  dot: {
    position: 'absolute',
    height: 15,
    width: 15,
    borderRadius: 50,
    top: 50,
    borderWidth: 1,
    borderColor: 'white',
    left: 50,
  },
});

export default User;
