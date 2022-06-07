import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import User from '../../components/User';
import Group from '../../components/Group';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';

const Separator = () => {
  return (
    <View
      style={{
        height: 100,
        width: 1,
        backgroundColor: 'white',
        marginLeft: 5,
      }}
    />
  );
};

const FlatList_Header = () => {
  return (
    <View>
      <Text style={{fontFamily: 'Montserrat-Regular'}}>
        {' '}
        Sample FlatList Header{' '}
      </Text>
    </View>
  );
};

const RoomScreen = ({setCurrentChat}) => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(true);
  const {account, onlineUsers, isChanged, setIsChanged} =
    useContext(AppContext);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(config.API_SERVER + 'user/users');
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const getGroups = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        config.API_SERVER + 'rooms/' + account.user._id,
      );
      console.log(res.data);
      setGroups(res.data.filter(g => g.type !== 'PRIVATE'));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    if (isChanged) {
      getUsers();
      getGroups();
      setIsChanged(false);
    }
  }, [isChanged]);
  useEffect(() => {
    getUsers();
    getGroups();
  }, []);

  const noUsers = () => {
    return (
      <View style={{marginLeft: 140, justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            fontFamily: 'Montserrat-Regular',
          }}>
          No online users
        </Text>
      </View>
    );
  };
  const noGroups = () => {
    return (
      <View style={{marginLeft: 140, justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            fontFamily: 'Montserrat-Regular',
            textAlign: 'center',
          }}>
          You have no groups!
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.MainContainer}>
      <View style={styles.header}>
        <Text style={styles.titleText}>
          {filter
            ? 'USERS: ' +
              users.filter(user => user._id !== account?.user._id).length
            : 'GROUPS: ' + groups.length}
        </Text>
        <TouchableOpacity onPress={() => setFilter(!filter)}>
          <Text style={styles.titleText}>
            {filter ? 'Show groups' : 'Show users'}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'relative',
          flex: 1,
          padding: 10,
        }}>
        <FlatList
          style={{position: 'absolute'}}
          data={
            filter
              ? users.filter(user => user._id !== account?.user._id)
              : groups
          }
          renderItem={({item}) =>
            loading === false ? (
              filter ? (
                <View key={item._id}>
                  <User
                    user={item}
                    online={onlineUsers.some(o => o.userId === item._id)}
                  />
                </View>
              ) : (
                <View key={item._id}>
                  <Group group={item} />
                </View>
              )
            ) : (
              <ActivityIndicator style={styles.loading} size="large" />
            )
          }
          keyExtractor={item => item.id}
          horizontal={true}
          ListEmptyComponent={filter ? noUsers : noGroups}
          // ListHeaderComponent={FlatList_Header}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    fontFamily: 'Montserrat-Regular',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 180,
  },
});

export default RoomScreen;
