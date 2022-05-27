import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileContent from '../../components/Profile/ProfileContent';
const ProfileScreen = ({route}) => {
  const {user} = route.params;
  return (
    <ScrollView style={styles.container}>
      <ProfileHeader user={user} />

      <ProfileContent user={user} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProfileScreen;
