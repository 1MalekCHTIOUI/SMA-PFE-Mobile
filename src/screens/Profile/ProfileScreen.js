import React from 'react';
import {View, StyleSheet} from 'react-native';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileContent from '../../components/Profile/ProfileContent';
const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <ProfileHeader />
      <ProfileContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProfileScreen;
