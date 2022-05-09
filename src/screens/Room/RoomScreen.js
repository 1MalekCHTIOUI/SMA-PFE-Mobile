import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {View, Text,ScrollView,SafeAreaView, StyleSheet, FlatList} from 'react-native';
import User from '../../components/User';
import config from '../../config';
import { AppContext } from '../../Context/AppContext';

const Separator = () => {
    return (
      <View
        style={{
          height: 100,
          width: 1,
          backgroundColor: "white",
        }}
      />
    );
}
const RoomScreen = ({setCurrentChat}) => {
    const [users, setUsers] = useState([])
    const { account } = useContext(AppContext)
    const getUsers = async () => {
        try {
            const res = await axios.get(config.API_SERVER + 'user/users')
            setUsers(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getUsers()
    }, [])



    return (
        <SafeAreaView style={styles.MainContainer}>
            <FlatList
                data={users.filter(user => user._id !== account.user._id)}
                onPress={() => userHasRoom(item)}
                renderItem={({ item }) => <User user={item} />}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={Separator}
                horizontal={true}
            />
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 10
    }, 
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 12
    },

})

export default RoomScreen;
