import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Signin from '../screens/Signin'
import Dashboard from '../screens/Dashboard'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
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
    
    return (
    <NavigationContainer>
        {
            isLoggedIn===false ? (
                <Stack.Navigator>
                    <Stack.Screen name="Signin" component={Signin}
                        options={{
                        tabBarLabel: 'Signin',
                        tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="login" color={color} size={29} style={{ marginTop: 1}} />
                        ),
                        }}/> 
                                
                </Stack.Navigator>
            ): (
                <Tab.Navigator initialRouteName='Dashboard'
                screenOptions={{
                    tabBarInactiveBackgroundColor: "rgba(0,0,0,0.5)",
                    tabBarActiveBackgroundColor: "rgba(0,0,0,0.2)",
                    tabBarInactiveTintColor: "black",
                    tabBarActiveTintColor: "black",
                    tabBarIconStyle: { marginTop: 4},
                    tabBarLabelStyle: { fontSize: 13, color: 'black', paddingBottom: 3},
                    tabBarStyle: {height: 55, position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4, borderTopWidth: 0},
                    style: { borderColor: '#011f3b' },
                    headerShown: false,
                    unmountOnBlur: true,
                }}
            >
                <Tab.Screen name="Dashboard" component={Dashboard}
                     options={{
                       tabBarLabel: 'Dashboard',
                       tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="account-circle" color={color} size={29} style={{ marginTop: 1}} />
                      ),
                     }}
                />
            </Tab.Navigator>
            )

        }

    </NavigationContainer>
    );
}