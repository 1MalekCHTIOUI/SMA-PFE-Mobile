import axios from 'axios';
import React, {createRef, useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {
  Menu,
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';
// import DUMMY from '../../../public/uploads/profilePictures/camp.png'
import {useNavigation} from '@react-navigation/native';

const User = ({user, online}) => {
  const [data, setData] = useState(null);
  // const [l, setL] = useState(false);
  const {userHasRoom} = useContext(AppContext);
  const navigation = useNavigation();
  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       setL(true);
  //       const res = await axios.get(config.API_SERVER + 'user/users/' + user);
  //       setData(res.data);
  //       setL(false);
  //     } catch (error) {
  //       setL(false);
  //       console.log(error);
  //     }
  //   };
  //   getUser();
  //   return () => setData(null);
  // }, []);
  const menu = createRef();
  return (
    <MenuContext>
      <View style={styles.container}>
        {/* <Pressable
          style={styles.item}
          key={user._id}
          // onLongPress={() => log}
          onPress={() => userHasRoom(user)}> */}
        {/* {l ? (
        <ActivityIndicator size="large" />
      ) : ( */}

        {/* )} */}

        <Menu style={styles.item} ref={r => (menu.current = r)}>
          <MenuTrigger
            customStyles={{
              triggerTouchable: {
                onLongPress: () => {
                  menu.current.open();
                },
              },
            }}>
            <View key={user._id} style={{position: 'relative'}}>
              <View style={{width: 40, height: 40, marginLeft: 15}}>
                <Image
                  resizeMode="contain"
                  source={
                    user.profilePicture
                      ? {
                          uri: config.CONTENT + user.profilePicture,
                        }
                      : require('../../assets/images/user.png')
                  }
                  style={[
                    styles.circleborder,
                    !user.profilePicture && {tintColor: 'white'},
                  ]}
                />
              </View>
              <Text style={styles.itemText}>{user?.first_name}</Text>
              <View
                style={
                  online
                    ? [styles.dot, {backgroundColor: '#1dc249'}]
                    : [styles.dot, {backgroundColor: 'red'}]
                }></View>
            </View>
          </MenuTrigger>

          <MenuOptions>
            <MenuOption
              onSelect={() => navigation.navigate('Profiles', {user: user})}>
              <Text style={{color: 'black'}}>Profile</Text>
            </MenuOption>

            <MenuOption onSelect={() => userHasRoom(user)}>
              <Text style={{color: 'black'}}>Message</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
        {/* </Pressable> */}
      </View>
    </MenuContext>
  );
};

const styles = StyleSheet.create({
  item: {
    marginLeft: 15,
    height: '100%',
    width: '100%',
  },
  itemText: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
    color: 'white',
  },
  circleborder: {
    overflow: 'hidden',
    borderWidth: 1,
    width: 40,
    height: 40,
    borderRadius: 150,
    borderColor: 'white',
  },
  dot: {
    position: 'absolute',
    height: 12,
    width: 12,
    borderRadius: 50,
    top: 30,
    borderWidth: 1,
    borderColor: 'white',
    left: 40,
  },
});

export default User;
