import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {View,SafeAreaView, Image, Text, StyleSheet, ActivityIndicator} from 'react-native';
import { AppContext } from '../../Context/AppContext';
;
const DashboardScreen = () => {
    const {onlineUsers} = useContext(AppContext)
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={{color: 'white',marginRight: 105, fontFamily: 'sans-serif',}}>ONLINE USERS</Text>
                <View
                    style={{
                    height: 100,
                    width: 1,
                    backgroundColor: "white",
                    }}
                />
                <Text style={{color: 'white'}}>{onlineUsers?.length}</Text>
            </View>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        width: '100%',
        backgroundColor: '#F5FBFF'
    },
    card: {
        flexDirection: 'row',
        height: 100,
        margin: 10,
        borderRadius: 5,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'tomato'
    }
})

export default DashboardScreen;
