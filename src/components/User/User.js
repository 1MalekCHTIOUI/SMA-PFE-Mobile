import axios from 'axios';
import React, { useContext } from 'react';
import {View,Text, StyleSheet, Image} from 'react-native';
import config from '../../config';
import { AppContext } from '../../Context/AppContext'
import DUMMY from '../../../public/uploads/profilePictures/camp.png'
const User = ({user}) => {
    const { setId, setCurrentChat, setCurrentChatUser, setExistInRoom, account } = useContext(AppContext)
    const userHasRoom = async (user) => {
        console.log("userHasRoom called");

        try {
            setId(user._id)
            setCurrentChatUser(user)
            const res = await axios.get(config.API_SERVER + "rooms/" + user._id)
            if(res.data.length === 0) {
                console.log("No room found");
            }
            const resp = res.data.map(room => {
                if(room.members.includes(account.user._id) && room.type==='PRIVATE'){
                    setCurrentChat(room)
                    return true
                }
                else {
                    return false
                }
            })

            if(resp.includes(true)) {
                setExistInRoom(true)
            } else {
                setExistInRoom(false)
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View style={styles.item}>
            <Image source={DUMMY} style={styles.circleborder}/>
            <Text onPress={() => userHasRoom(user)} style={styles.itemText}>{user.first_name}</Text>
        </View>
    );
}



const styles = StyleSheet.create({
    item: {
        padding: 10,
        width: 120,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    
    itemText: {
        fontSize: 12,
        color: 'black',
        textAlign: 'center'
    },
    circleborder: {
        width: 70,
        height: 70,
        borderRadius: 150,
    }
})

export default User;
