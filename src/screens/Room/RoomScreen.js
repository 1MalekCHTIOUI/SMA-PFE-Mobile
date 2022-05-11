import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {View, Text,ScrollView,SafeAreaView, ActivityIndicator, StyleSheet, FlatList} from 'react-native';
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


  const FlatList_Header = () => {
    return (
      <View>

        <Text> Sample FlatList Header </Text>

      </View>
    );
  }

const RoomScreen = ({setCurrentChat}) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const { account, onlineUsers } = useContext(AppContext)

    const getUsers = async () => {
        try {
            setLoading(true)
            const res = await axios.get(config.API_SERVER + 'user/users')
            setUsers(res.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    useEffect(()=>{
        getUsers()
    }, [])
    const noUsers = () => {
      return <View style={{marginLeft: 140, justifyContent: 'center'}}><Text style={{fontSize: 15, fontWeight: 'bold'}}>No online users</Text></View>
    }
    return (
        <SafeAreaView style={styles.MainContainer}>
            <Text style={styles.titleText}>ONLINE USERS: {users.filter(user => user.userId !== account?.user._id).length}</Text>
            <FlatList
                data={users.filter(user => user.userId !== account?.user._id)}
                onPress={() => userHasRoom(item)}
                renderItem={({ item }) => loading===false ? <User user={item.userId} /> : <ActivityIndicator style={styles.loading} size="large" />}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={Separator}
                horizontal={true}
                ListEmptyComponent={noUsers}
                // ListHeaderComponent={FlatList_Header}
            />
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: 'orange',
        borderRadius: 10,
        flexDirection: 'column',
    }, 
    titleText: {
        fontSize: 15,
        fontWeight: 'bold',
        padding: 10,
        height: 40,
        justifyContent: 'center',
        marginBottom: 0,
        color: 'white',
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 180,
    }

})

export default RoomScreen;
