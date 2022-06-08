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
  RefreshControl,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';
import Post from '../../components/Post/Post';
import Share from '../../components/Profile/Share';
const DashboardScreen = () => {
  const {onlineUsers, account, newPost, setNewPost} = useContext(AppContext);
  const [isLoading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [todaysPosts, setTodaysPosts] = useState(null);
  const [onliners, setOnliners] = useState([]);

  //   const classes = useStyles();
  useEffect(() => {
    setLoading(false);
    return () => {
      setPostsLoading(false);
      setTodaysPosts(null);
      setPosts([]);
      setLoading(false);
    };
  }, []);

  const [usersLoading, setUsersLoading] = React.useState(false);
  const getOnlineUsers = () => {
    onlineUsers?.map(async item => {
      try {
        setUsersLoading(true);

        setOnliners(prev => [...prev, item.user]);
        setUsersLoading(false);
      } catch (error) {
        setUsersLoading(false);
        console.log(error);
      }
    });
    // setOnliners(onlineIsers1)
  };
  React.useEffect(() => {
    getOnlineUsers();
  }, [onlineUsers]);

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

  React.useEffect(() => {
    fetchPublicPosts();
  }, []);
  React.useEffect(() => {
    setTodaysPosts(
      posts.filter(p => moment().diff(p.createdAt, 'hours') < 24).length,
    );
  }, [posts]);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setPosts([]);
    fetchPublicPosts();

    // changeColor('green');
    setRefreshing(false);
  };
  const handleRefresh = () => {
    setPosts([]);
    fetchPublicPosts();
    setNewPost(null);
  };
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
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
        <Share user={account.user} setPosts={setPosts} />
      </View>
      {postsLoading && refreshing && (
        <ActivityIndicator animating={postsLoading} size="large" />
      )}
      <View style={styles.ann}>
        <ScrollView horizontal={true}>
          {posts
            ?.filter(post => post.priority === true)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((item, index) => (
              <View key={index}>
                <Post post={item} index={index} />
              </View>
            ))}
        </ScrollView>
      </View>
      <View>
        {newPost && (
          <TouchableOpacity onPress={handleRefresh}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <Text>New post available</Text>
              <Image
                source={require('../../assets/icons/reload.png')}
                style={{width: 30, height: 30}}
              />
            </View>
          </TouchableOpacity>
        )}
        {posts
          ?.filter(post => post.priority === false)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((item, index) => (
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
  ann: {
    // padding: 5,
    marginTop: 10,
    marginBottom: 5,
    elevation: 1,
  },
});

export default DashboardScreen;
