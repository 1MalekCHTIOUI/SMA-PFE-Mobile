import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Signin from '../screens/Signin'
import Dashboard from '../screens/Dashboard'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Chat from '../screens/Chat';
import Message from '../screens/Message';




export default function Routes(){
    const account = useSelector(s => s.account)
    const [isLoggedIn, setLoggedIn] = useState(null)
    useEffect(()=>{
        if(account && account.token) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    }, [account])
    const Tab = createBottomTabNavigator();
    const MessagesStack = createStackNavigator();
    const SigninStack = createStackNavigator();
    const DashboardStack = createStackNavigator();
    const ChatStackScreen = () => {
        return (
            <MessagesStack.Navigator> 
                <MessagesStack.Screen name="Chats" component={Chat} /> 
                <MessagesStack.Screen name="Messages" component={Message} /> 
            </MessagesStack.Navigator>
        )
    }
    const DashboardStackScreen = () => {
        return (
            <DashboardStack.Navigator> 
                <DashboardStack.Screen name="DashboardScreen" component={Dashboard} />  
                
            </DashboardStack.Navigator>
        )
    }
    const SigninStackScreen = () => {
        return (
            <SigninStack.Navigator> 
                <SigninStack.Screen name="SigninScreen" component={Signin} /> 
            </SigninStack.Navigator>
        )
    }
    return (
        <>
            <NavigationContainer> 
                {
                    isLoggedIn ?
                        <Tab.Navigator initialRouteName='Dashboard'
                        screenOptions={{
                            tabBarInactiveBackgroundColor: "rgba(0,0,0,0.5)",
                            tabBarActiveBackgroundColor: "rgba(0,0,0,0.2)",
                            tabBarInactiveTintColor: "tomato",
                            tabBarActiveTintColor: "gray",
                            tabBarIconStyle: { marginTop: 4},
                            tabBarLabelStyle: { fontSize: 13, color: 'black', paddingBottom: 3},
                            tabBarStyle: {height: 55, position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4, borderTopWidth: 0},
                            style: { borderColor: '#011f3b' },
                            headerShown: false,
                            unmountOnBlur: true,
                        }}
                        >
                            <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
                            <Tab.Screen name="Chat" component={ChatStackScreen} />
                        </Tab.Navigator>
                    : <Tab.Screen name="Signin" component={SigninStackScreen} />
                }

            </NavigationContainer>


            <NavigationContainer>        

            </NavigationContainer>
        </>
    );
}