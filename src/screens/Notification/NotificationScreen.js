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
import CustomButton from '../../components/CustomButton';
import Notification from '../../components/Notification';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';
const NotificationScreen = () => {
  const {account} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const getNotifications = async () => {
    try {
      setLoading(true);
      const n = await axios.get(
        config.API_SERVER + 'notifications/' + account.user._id,
      );
      setNotifications(n.data);
      setLoading(false);
    } catch (error) {
      setLoading(true);
      console.log(error);
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);
  const deleteNotifications = async () => {
    try {
      await axios.delete(
        config.API_SERVER + 'notifications/' + account.user._id,
      );
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
        {notifications?.map(n => (
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
