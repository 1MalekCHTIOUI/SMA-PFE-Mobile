import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {View,ScrollView, Image, Text, StyleSheet, ActivityIndicator} from 'react-native';
import { AppContext } from '../../Context/AppContext';
;
const DashboardScreen = () => {
    const {onlineUsers} = useContext(AppContext)
    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={{color: 'white',marginRight: 105, fontFamily: 'Montserrat-Regular',}}>ONLINE USERS</Text>
                <View
                    style={{
                    height: 100,
                    width: 1,
                    backgroundColor: "white",
                    }}
                />
                <Text style={{color: 'white'}}>{onlineUsers?.length}</Text>
            </View>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        width: '100%',
        backgroundColor: 'white'
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
