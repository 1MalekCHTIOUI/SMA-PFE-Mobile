import React, { useContext } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { AppContext } from '../../Context/AppContext';
import {format} from 'timeago.js'
const Message = ({message, own}) => {

    return (
        <View style={own ? styles.ownMessageContainer : styles.freindMessageContainer}>
            <Text style={styles.text}>{message.text}</Text>
            <Text style={styles.date}>{format(message.createdAt)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    freindMessageContainer: {
        justifyContent: 'center',
        width:"40%",
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 9,
        margin: 3,
        borderRadius: 1,
        alignSelf: 'flex-end',
        marginTop: 5
    },
    ownMessageContainer: {
        justifyContent: 'center',
        width:"40%",
        backgroundColor: 'rgba(144, 202, 249, 0.6)',
        padding: 9,
        margin: 3,
        borderRadius: 1,
        alignSelf: 'flex-start',
        marginTop: 5
    },
    text: {
        color: 'black', 
        fontSize: 19,
    },
    date: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 13
    }
})

export default Message;
