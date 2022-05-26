import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {format} from 'timeago.js';
const Notification = ({notification}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={{
            color: 'white',
            fontSize: 15,
            fontFamily: 'Montserrat-Regular',
          }}>
          {notification.title}
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={{color: 'white', fontSize: 17}}>
          {notification.content}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={{fontFamily: 'Montserrat-Regular'}}>
          {format(notification.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    backgroundColor: '#638fb6',
    borderWidth: 0.3,
    borderRadius: 10,
  },
  header: {
    height: 30,
  },
  body: {
    justifyContent: 'center',
    height: 50,
    display: 'flex',
  },
  footer: {
    height: 30,
  },
});

export default Notification;
