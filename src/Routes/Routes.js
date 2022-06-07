import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Signin from '../screens/Signin';
import Dashboard from '../screens/Dashboard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import Chat from '../screens/Chat';
import Message from '../screens/Message';
import Video from '../screens/VideoChat';
import Account from '../screens/Account';
import EditAccount from '../screens/EditAccount';
import Notification from '../screens/Notification';
import {navigationRef} from '../Context/navRef';
import Profile from '../screens/Profile';
import {AppContext} from '../Context/AppContext';

export default function Routes() {
  const account = useSelector(s => s.account);
  // const {notificationsCount} = useContext(AppContext);
  const Tab = createBottomTabNavigator();
  const ChatStack = createStackNavigator();
  const SigninStack = createStackNavigator();
  const DashboardStack = createStackNavigator();
  const SettingsStack = createStackNavigator();
  const NotificationStack = createStackNavigator();
  const ChatStackScreen = () => {
    return (
      <ChatStack.Navigator>
        <ChatStack.Screen name="Chats" component={Chat} />
        <ChatStack.Screen
          name="Messages"
          options={{
            headerShown: false,
          }}
          component={Message}
        />
        {/* <ChatStack.Screen name="Videos" component={Video} /> */}
        <ChatStack.Screen name="Profiles" component={Profile} />
      </ChatStack.Navigator>
    );
  };
  const SettingsStackScreen = () => {
    return (
      <SettingsStack.Navigator>
        <SettingsStack.Screen name="Settings" component={Account} />
        <SettingsStack.Screen name="Edit" component={EditAccount} />
        <SettingsStack.Screen
          name="userProfile"
          options={{
            headerShown: false,
          }}
          component={Profile}
        />
      </SettingsStack.Navigator>
    );
  };
  const DashboardStackScreen = () => {
    return (
      <DashboardStack.Navigator screenOptions={{headerShown: false}}>
        <DashboardStack.Screen name="Dashboard" component={Dashboard} />
      </DashboardStack.Navigator>
    );
  };
  const NotificationStackScreen = () => {
    return (
      <NotificationStack.Navigator screenOptions={{headerShown: false}}>
        <NotificationStack.Screen
          name="Notification"
          component={Notification}
        />
      </NotificationStack.Navigator>
    );
  };
  const SigninStackScreen = () => {
    return (
      <SigninStack.Navigator screenOptions={{headerShown: false}}>
        <SigninStack.Screen name="Signin" component={Signin} />
      </SigninStack.Navigator>
    );
  };
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        {account.isLoggedIn ? (
          <Tab.Navigator
            screenOptions={{
              lazy: false,
              tabBarShowLabel: false,
              headerShown: false,
              tabBarStyle: {
                height: 60,
              },
            }}>
            <Tab.Screen
              name="DashboardScreen"
              component={DashboardStackScreen}
              options={{
                tabBarIcon: ({focused}) => (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      source={require('../../public/uploads/home.png')}
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: focused ? '#e32f45' : '#748c94',
                      }}
                    />
                    <Text
                      style={{
                        color: focused ? '#e32f45' : '#748c94',
                        fontSize: 12,
                      }}>
                      Dashboard
                    </Text>
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="ChatScreen"
              component={ChatStackScreen}
              options={{
                tabBarIcon: ({focused}) => (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      source={require('../../public/uploads/chat.png')}
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: focused ? '#e32f45' : '#748c94',
                      }}
                    />
                    <Text
                      style={{
                        color: focused ? '#e32f45' : '#748c94',
                        fontSize: 12,
                      }}>
                      Chat
                    </Text>
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="NotificationScreen"
              component={NotificationStackScreen}
              options={{
                tabBarBadge: 0,
                tabBarIcon: ({focused}) => (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      source={require('../assets/images/notification.png')}
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: focused ? '#e32f45' : '#748c94',
                      }}
                    />
                    <Text
                      style={{
                        color: focused ? '#e32f45' : '#748c94',
                        fontSize: 12,
                      }}>
                      Notification
                    </Text>
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="SettingScreen"
              component={SettingsStackScreen}
              options={{
                tabBarIcon: ({focused}) => (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      source={require('../../public/uploads/setting.png')}
                      resizeMode="contain"
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: focused ? '#e32f45' : '#748c94',
                      }}
                    />
                    <Text
                      style={{
                        color: focused ? '#e32f45' : '#748c94',
                        fontSize: 12,
                      }}>
                      Settings
                    </Text>
                  </View>
                ),
              }}
            />
          </Tab.Navigator>
        ) : (
          <SigninStack.Navigator screenOptions={{headerShown: false}}>
            <SigninStack.Screen name="Signin" component={Signin} />
          </SigninStack.Navigator>
        )}
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
