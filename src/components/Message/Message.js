import React, { useContext } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { AppContext } from '../../Context/AppContext';
import {format} from 'timeago.js'
const Message = ({message, own}) => {

    return (
        <>
        <View style={own ? styles.ownMessageContainer : styles.freindMessageContainer}>
            <Text style={own? styles.text : [styles.text, {color: 'black'}]}>{message.text}</Text>
        </View>
        <Text style={[own ? {alignSelf: 'flex-end', marginRight: 5} : {alignSelf: 'flex-start'} ,styles.date]} >{format(message.createdAt)}</Text>
        </>
    );
}

const styles = StyleSheet.create({
    freindMessageContainer: {
        justifyContent: 'center',
        width:"40%",
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: 13,
        margin: 3,
        borderRadius: 2,
        alignSelf: 'flex-start',
        marginTop: 5
    },
    ownMessageContainer: {
        justifyContent: 'center',
        width:"40%",
        backgroundColor: '#FF553F',
        padding: 13,
        margin: 3,
        borderRadius: 7,
        alignSelf: 'flex-end',
        marginTop: 5
    },
    text: {
        color: 'white', 
        fontFamily: 'Montserrat-Medium',
        wordBreak: 'break-all',
    },
    date: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 13
    }
})

export default Message;
