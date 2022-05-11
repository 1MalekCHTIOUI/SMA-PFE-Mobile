import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Signin from '../screens/Signin'
import Dashboard from '../screens/Dashboard'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Chat from '../screens/Chat';
import Message from '../screens/Message';
import Account from '../screens/Account';
import EditAccount from '../screens/EditAccount';




export default function Routes(){
    const account = useSelector(s => s.account)

    const Tab = createBottomTabNavigator();
    const ChatStack = createStackNavigator();
    const SigninStack = createStackNavigator();
    const DashboardStack = createStackNavigator();
    const SettingsStack = createStackNavigator();
    const ChatStackScreen = () => {
        return (
            <ChatStack.Navigator> 
                <ChatStack.Screen name="Chats" component={Chat} /> 
                <ChatStack.Screen name="Messages" component={Message} /> 
            </ChatStack.Navigator>
        )
    }
    const SettingsStackScreen = () => {
        return (
            <SettingsStack.Navigator> 
                <SettingsStack.Screen name="Settings" component={Account} /> 
                <SettingsStack.Screen name="Edit" component={EditAccount} /> 
            </SettingsStack.Navigator>
        )
    }
    const DashboardStackScreen = () => {
        return (
            <DashboardStack.Navigator screenOptions={{headerShown: false}}> 
                <DashboardStack.Screen name="Dashboard" component={Dashboard} />  
            </DashboardStack.Navigator>
        )
    }
    const SigninStackScreen = () => {
        return (
            <SigninStack.Navigator screenOptions={{headerShown: false}}> 
                <SigninStack.Screen name="Signin" component={Signin} /> 
            </SigninStack.Navigator>
        )
    }
    return (
        <>
            <NavigationContainer> 
                {
                    account.isLoggedIn ?
                        <Tab.Navigator
                            screenOptions={{
                                tabBarShowLabel: false,
                                headerShown: false,
                                tabBarStyle: {
                                    height: 60,
                                    ...styles.shadow
                                }
                            }}
                        >
                            <Tab.Screen name="DashboardScreen" component={DashboardStackScreen} options={{
                                tabBarIcon: ({focused}) => (
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <Image
                                            source={require('../../public/uploads/home.png')}
                                            resizeMode='contain'
                                            style={{width: 25, height: 25, tintColor: focused ? '#e32f45' : '#748c94'}}
                                        />
                                        <Text style={{color: focused ? '#e32f45':'#748c94', fontSize: 12}}>Dashoard</Text>
                                    </View>
                                )
                            }} />
                            <Tab.Screen name="ChatScreen" component={ChatStackScreen} options={{
                                tabBarIcon: ({focused}) => (
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <Image
                                            source={require('../../public/uploads/chat.png')}
                                            resizeMode='contain'
                                            style={{width: 25, height: 25, tintColor: focused ? '#e32f45' : '#748c94'}}
                                        />
                                        <Text style={{color: focused ? '#e32f45':'#748c94', fontSize: 12}}>Chat</Text>
                                    </View>
                                )
                            }} />
                            <Tab.Screen name="SettingScreen" component={SettingsStackScreen} options={{
                                tabBarIcon: ({focused}) => (
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <Image
                                            source={require('../../public/uploads/setting.png')}
                                            resizeMode='contain'
                                            style={{width: 25, height: 25, tintColor: focused ? '#e32f45' : '#748c94'}}
                                        />
                                        <Text style={{color: focused ? '#e32f45':'#748c94', fontSize: 12}}>Settings</Text>
                                    </View>
                                )
                            }} />
                        </Tab.Navigator>
                    : <SigninStack.Navigator screenOptions={{headerShown: false}}> 
                        <SigninStack.Screen name="Signin" component={Signin} /> 
                    </SigninStack.Navigator>
                }

            </NavigationContainer>
        </>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0', 
        shadowOffset:{
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    },
})