import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';

import config from '../../config';
import {AppContext} from '../../Context/AppContext';
import Post from '../Post/Post';
import Share from './Share';
const ProfileContent = ({user}) => {
  const {account} = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const getPosts = async () => {
    try {
      setPostsLoading(true);
      const res = await axios.get(config.API_SERVER + 'posts/' + user._id);
      setPosts(
        res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
      setPostsLoading(false);
    } catch (error) {
      setPostsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <View style={styles.content}>
      <Share user={user} setPosts={setPosts} />
      <View style={styles.postsWrapper}>
        {posts &&
          postsLoading === false &&
          posts
            .filter(p => p.priority === false)
            .map(post => {
              if (account.user._id === user._id) {
                return <Post post={post} />;
              } else if (post.visibility === true) {
                return <Post post={post} />;
              }
            })}
        {posts.length === 0 && (
          <Text style={{fontSize: 20, color: 'black', textAlign: 'center'}}>
            No posts!
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  postsWrapper: {},
});

export default ProfileContent;
