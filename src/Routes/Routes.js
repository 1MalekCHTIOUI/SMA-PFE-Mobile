import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signin from '../screens/Signin'
import Dashboard from '../screens/Dashboard'
import AuthGuard from '../utils/route-guard/AuthGuard'



const AppStack = createStackNavigator();
export default function Routes(){
    
    return (
    <NavigationContainer>
        <AppStack.Navigator screenOptions={{ headerShown: true }} >
            <AppStack.Screen name="Signin" component={Signin} />
            <AppStack.Screen name="Dashboard" component={Dashboard} />
        </AppStack.Navigator>
    </NavigationContainer>
    );
}