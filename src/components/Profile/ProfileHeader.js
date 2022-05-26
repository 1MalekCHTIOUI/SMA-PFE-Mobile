import React, {useContext} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';

const ProfileHeader = () => {
  const {account} = useContext(AppContext);
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
        {account.user.profilePicture && (
          <Image
            style={styles.profileImage}
            resizeMode="contain"
            source={{uri: config.CONTENT + account.user.profilePicture}}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    display: 'flex',

    position: 'relative',
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
});

export default ProfileHeader;
