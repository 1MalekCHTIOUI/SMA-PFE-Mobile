import React, {useContext} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {format} from 'timeago.js';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';
import {capitalizeFirstLetter, replaceDash} from '../../utils/scripts';
import moment from 'moment';
const ProfileHeader = ({user}) => {
  console.log(user);
  // const {account} = useContext(AppContext);
  return (
    <View style={styles.header}>
      <View style={styles.coverContainer}>
        {/* {account.user.profilePicture && (
          <Image
            style={styles.coverImage}
            resizeMode="cover"
            source={{uri: config.CONTENT + account.user.profilePicture}}
          />
        )} */}
      </View>
      <View style={styles.profileContainer}>
        {user.profilePicture ? (
          <Image
            style={styles.profileImage}
            resizeMode="contain"
            source={{uri: config.CONTENT + user.profilePicture}}
          />
        ) : (
          <Image
            style={styles.profileImage}
            resizeMode="contain"
            source={require('../../assets/images/user.png')}
          />
        )}
      </View>
      <View style={styles.bio}>
        <Text style={styles.name}>{user.first_name}</Text>
        <Text style={styles.last}>{user.last_name}</Text>
      </View>
      <View style={{display: 'flex'}}>
        <Text style={styles.service}>{user?.service?.toLowerCase()}</Text>
        <Text style={styles.service}>
          {moment().format('DD/MM/YYYY', user.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    marginBottom: 50,
  },
  profileContainer: {
    position: 'absolute',
    top: '40%',
    left: '35%',
    display: 'flex',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: 'white',
  },
  coverContainer: {
    width: '100%',
    minHeight: 150,
    backgroundColor: 'grey',
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  bio: {
    // marginBottom: 10,
    // width: '100%',
    // height: 150,
  },
  name: {
    marginLeft: 10,
    color: 'black',
    // letterSpacing: 1,
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
  },
  last: {
    marginLeft: 10,
    fontFamily: 'Montserrat-Medium',
    color: 'black',
  },
  service: {
    marginLeft: 10,
    fontFamily: 'Montserrat-Regular',
    color: 'black',
  },
});

export default ProfileHeader;
