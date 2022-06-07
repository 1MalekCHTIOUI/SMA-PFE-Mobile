import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import Notification from '../../components/Notification';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';
const NotificationScreen = () => {
  const {account, setNotificationsCount, notificationsCount} =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();
  const getNotifications = async () => {
    try {
      setLoading(true);
      const n = await axios.get(
        config.API_SERVER + 'notifications/' + account.user._id,
      );
      setNotifications(n.data);
      navigation.setOptions({
        tabBarBadge: n.data.length,
      });
      setLoading(false);
    } catch (error) {
      setLoading(true);
      console.log(error);
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);
  useEffect(() => {
    setNotificationsCount(notifications.length);
  }, [notifications]);
  // useEffect(() => {
  //   navigation.setOptions({
  //     tabBarBadge: notificationsCount,
  //   });
  // }, [notificationsCount]);
  const deleteNotifications = async () => {
    try {
      await axios.delete(
        config.API_SERVER + 'notifications/' + account.user._id,
      );
      // setNotificationsCount(0);
      setNotifications([]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={loading} />
      <View style={styles.header}>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontFamily: 'Montserrat-Bold',
          }}>
          Notifications: {notifications.length}
        </Text>
      </View>
      <View>
        {notifications.length > 0 && (
          <CustomButton
            text="Delete notifications"
            onPress={deleteNotifications}
          />
        )}
      </View>
      <ScrollView>
        {notifications
          ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(n => (
            <View key={n._id}>
              <Notification notification={n} />
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 40,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationScreen;
