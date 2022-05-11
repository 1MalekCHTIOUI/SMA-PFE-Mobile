import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {View,Text, StyleSheet, Image, Pressable, ActivityIndicator} from 'react-native';
import config from '../../config';
import { AppContext } from '../../Context/AppContext'
import DUMMY from '../../../public/uploads/profilePictures/camp.png'
const User = ({user}) => {
    const [data, setData] = useState(null)
    const [l, setL] = useState(false)
    const { userHasRoom } = useContext(AppContext)

    useEffect(async () =>{
        try {
            setL(true)
            const res = await axios.get(config.API_SERVER+'user/users/'+user)
            setData(res.data)
            setL(false)
        } catch (error) {
            setL(false)
            console.log(error);
        }
    }, [])

    return (
        <Pressable style={styles.item} onPress={() => userHasRoom(user)}>
            {
                l ? <ActivityIndicator size='large' /> : 
                <View>
                    <View>                
                        <Image resizeMode='contain' source={DUMMY} style={styles.circleborder}/>
                    </View>
                    <Text style={styles.itemText}>{data?.first_name}</Text>
                </View>
            }
            
        </Pressable>
    );
}



const styles = StyleSheet.create({
    item: {
        marginLeft: 15,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    itemText: {
        fontSize: 12,
        color: 'black',
        textAlign: 'center',
        color: 'white'
    },
    circleborder: {
        overflow: 'hidden',
        borderWidth: 2,
        width: 70,
        height: 70,
        borderRadius: 150,
        borderColor: 'white',
        elevation: 8
    }
})

export default User;
