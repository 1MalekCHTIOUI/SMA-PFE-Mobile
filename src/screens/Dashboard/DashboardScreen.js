import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import moment from 'moment';
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';
import Post from '../../components/Post/Post';
const DashboardScreen = () => {
  const {onlineUsers, account} = useContext(AppContext);
  const [isLoading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [todaysPosts, setTodaysPosts] = useState(null);
  const [onliners, setOnliners] = useState([]);

  //   const classes = useStyles();
  useEffect(() => {
    setLoading(false);
  }, []);

  const [usersLoading, setUsersLoading] = React.useState(false);
  React.useEffect(() => {
    const getOnlineUsers = () => {
      onlineUsers?.map(async item => {
        try {
          setUsersLoading(true);
          const users = await axios.get(
            config.API_SERVER + 'user/users/' + item.userId,
          );
          onliners.find(u => u._id === users.data._id) === undefined &&
            setOnliners(prev => [...prev, users.data]);
          setUsersLoading(false);
        } catch (error) {
          setUsersLoading(false);
          console.log(error);
        }
      });
    };
    getOnlineUsers();
  }, [onlineUsers]);

  React.useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        setPostsLoading(true);
        const fetchPosts = await axios.get(config.API_SERVER + 'posts');
        setPosts(fetchPosts.data.filter(p => p.visibility === true));
        setPostsLoading(false);
      } catch (error) {
        setPostsLoading(false);
        console.log(error);
      }
    };
    fetchPublicPosts();
  }, []);
  React.useEffect(() => {
    setTodaysPosts(
      posts.filter(p => moment().diff(p.createdAt, 'hours') < 24).length,
    );
  }, [posts]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text
          style={{
            color: 'white',
            marginRight: 105,
            fontFamily: 'Montserrat-Regular',
          }}>
          ONLINE USERS
        </Text>
        <View
          style={{
            height: 100,
            width: 1,
            backgroundColor: 'white',
          }}
        />
        <Text style={{color: 'white'}}>{onlineUsers?.length}</Text>
      </View>
      <View>
        {posts.map((item, index) => (
          <View key={index}>
            <Post post={item} index={index} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  card: {
    flexDirection: 'row',
    height: 100,
    margin: 10,
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'tomato',
  },
});

export default DashboardScreen;
