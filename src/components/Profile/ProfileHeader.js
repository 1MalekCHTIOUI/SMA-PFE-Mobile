import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
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
      {/* <View style={styles.coverContainer}> */}
      {/* {account.user.profilePicture && (
          <Image
            style={styles.coverImage}
            resizeMode="cover"
            source={{uri: config.CONTENT + account.user.profilePicture}}
          />
        )} */}
      {/* </View> */}
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
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 'auto',
        }}>
        <View style={styles.bio}>
          <Text style={styles.name}>{user.first_name}</Text>
          <Text style={styles.last}>{user.last_name}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            elevation: 1.5,
            padding: 10,
            margin: 10,
          }}>
          <Text style={styles.service}>
            {capitalizeFirstLetter(user?.service)}
          </Text>
          <Text style={styles.service}>
            Joined: {moment().format('DD/MM/YYYY', user.createdAt)}
          </Text>
          {user?.social?.linkedin !== '' && (
            <TouchableOpacity
              onPress={() => Linking.openURL(user?.social.linkedin)}
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/icons/linkedin.png')}
                  style={{width: 30, height: 30}}
                />
              </View>
              <View>
                <Text style={styles.service}>{user?.social.linkedin}</Text>
              </View>
            </TouchableOpacity>
          )}
          {user?.social?.facebook !== '' && (
            <TouchableOpacity
              onPress={() => Linking.openURL(user?.social.facebook)}
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../../assets/icons/facebook.png')}
                style={{width: 30, height: 30}}
              />
              <View>
                <Text style={styles.service}>{user?.social.facebook}</Text>
              </View>
            </TouchableOpacity>
          )}
          {user?.social?.github !== '' && (
            <TouchableOpacity
              onPress={() => Linking.openURL(user?.social.github)}
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                flexDirection: 'row',
              }}>
              <View>
                <Image
                  source={require('../../assets/icons/github.png')}
                  style={{width: 30, height: 30}}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 54,
                }}>
                <Text style={styles.service}>{user?.social.github}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: '100%',
    display: 'flex',
    // flexDirection: 'column',
    // position: 'relative',
    marginBottom: 50,
  },
  profileContainer: {
    // position: 'absolute',
    // top: '40%',
    // left: '35%',
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
    textAlign: 'center',
    // letterSpacing: 1,
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
  },
  last: {
    marginLeft: 10,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    color: 'black',
  },
  service: {
    textAlign: 'center',
    marginLeft: 10,
    fontFamily: 'Montserrat-Regular',
    color: 'black',
  },
});

export default ProfileHeader;
