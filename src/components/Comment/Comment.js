import axios from 'axios';
import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Image, Text, ActivityIndicator} from 'react-native';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';

const Comment = ({comment}) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const account = useContext(AppContext);
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const fetchUser = await axios.get(
          config.API_SERVER + 'user/users/' + comment.uploadedBy.userId,
        );
        console.log(fetchUser.data);
        setUser(fetchUser.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    getUser();
  }, []);

  const [like, setLike] = useState(comment.likes.length);
  const [isLiked, setIsLiked] = useState(
    comment.likes.some(u => u.userId === account?.user._id),
  );

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  return (
    <View className="comment" key={comment._id}>
      <ActivityIndicator animating={loading} />
      <View className="commentWrapper">
        <Image
          style={{
            width: 32,
            height: 32,
            borderRadius: 4,
          }}
          source={
            user.profilePicture
              ? {uri: config.HOST + user.profilePicture}
              : require('../../assets/images/user.png')
          }
          alt=""
        />
        {/* <View className="commentContentWrapper">
          <View className="commentField">
            <Text className="commentUploader" variant="text">
              {user.first_name} {user.last_name}
            </Text>
            <Text>{comment?.content}</Text>
            {comment.attachment?.map(a => {
              if (a.includes('.jpg')) {
                return (
                  <Image
                    style={{
                      padding: 10,
                      width: '10%',
                      height: '10%',
                      borderRadius: 10,
                    }}
                    src={config.CONTENT + `${a}`}
                    alt=""
                  />
                );
              }
            })}
          </View>
          <View className="commentBottom">
            <Image
              className="likeIcon"
              source={require('../../assets/images/like.png')}
              onPress={likeHandler}
              alt=""
            />
            <Text className="commentLikeCounter">{like}</Text>
          </View>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    padding: 5,
  },

  commentWrapper: {
    display: 'flex',
    height: '100%',
    width: '100%',
    width: 'fit-content',
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  commentContentWrapper: {
    flexDirection: 'column',
    display: 'flex',
  },
  commentField: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 15,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#f0f2f5',
  },
  commentBottom: {
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    padding: 3,
    borderRadius: 5,
  },
  commentUploader: {
    display: 'flex',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  likeIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
});

export default Comment;
