import axios from 'axios';
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';
import likeImage from '../../assets/icons/like.png';
const isImage = str => {
  return str.includes('.png') || str.includes('.jpg');
};
const Comment = ({comment}) => {
  const [user, setUser] = useState({});
  const {account} = useContext(AppContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const fetchUser = await axios.get(
          config.API_SERVER + 'user/users/' + comment.uploadedBy.userId,
        );
        setUser(fetchUser.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    getUser();
    return () => setUser({});
  }, []);

  const [like, setLike] = useState(comment.likes.length);
  const [isLiked, setIsLiked] = useState(
    comment.likes.some(u => u.userId === account?.user._id),
  );

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    isLiked ? unlikeComment() : likeComment();
    setIsLiked(!isLiked);
  };

  const likeComment = async () => {
    try {
      await axios.put(config.API_SERVER + 'posts/comment/like/' + comment._id, {
        userId: account.user._id,
        username: `${user.first_name} ${user.last_name}`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const unlikeComment = async () => {
    try {
      await axios.put(
        config.API_SERVER + 'posts/comment/unlike/' + comment._id,
        {
          userId: account.user._id,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };
  const returnLikes = () => {
    if (isLiked) {
      if (like - 1 === 0) {
        return `You like it`;
      } else {
        return `You and ${like} people like it`;
      }
    } else {
      return `${like} people like it`;
    }
  };
  return (
    <View style={styles.comment} key={comment._id}>
      <ActivityIndicator animating={loading} />
      <View style={styles.commentWrapper}>
        <View style={styles.commentImageWrapper}>
          <Image
            style={styles.postProfileImg}
            resizeMode="cover"
            source={
              comment.uploadedBy.userId === user._id && user.profilePicture
                ? {uri: config.CONTENT + user.profilePicture}
                : require('../../assets/images/user.png')
            }
            alt=""
          />
        </View>
        <View style={styles.commentContentWrapper}>
          <View style={styles.commentField}>
            <Text style={styles.commentUploader} variant="text">
              {user.first_name} {user.last_name}
            </Text>
            <Text style={{color: 'black'}}>{comment?.content}</Text>
            <View>
              {comment.attachment?.map(a => {
                if (isImage(a.actualName)) {
                  return (
                    <Image
                      style={{
                        // padding: 10,
                        width: '100%',
                        height: 200,
                      }}
                      resizeMode="stretch"
                      source={{uri: config.CONTENT + a.actualName}}
                      alt=""
                    />
                  );
                }
              })}
            </View>
          </View>
          <TouchableOpacity onPress={likeHandler} style={styles.commentBottom}>
            <Image style={styles.likeIcon} source={likeImage} alt="" />
            <Text style={styles.commentLikeCounter}>
              {/* {isLiked
                ? 'You and' && like - 1 === 0
                  ? `like it`
                  : `${like} people like it`
                : ''} */}
              {returnLikes()}
              {/* {isLiked ? 'You and ' + `${like - 1} people like it` : ''}
              {!isLiked && `${like} people like it`} */}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  comment: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderTop: 'none',
  },

  commentWrapper: {
    display: 'flex',
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    borderRadius: 5,
    // paddingLeft: 15,
    // paddingRight: 15,
  },
  commentContentWrapper: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    width: '80%',
    height: '100%',
  },
  postProfileImg: {
    width: 55,
    height: 55,
    marginBottom: 25,
    borderRadius: 50,
    zIndex: 5,
  },
  commentImageWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '20%',
    flexDirection: 'row',
  },
  commentField: {
    display: 'flex',
    // alignItems: 'center',
    flex: 1,
    height: '100%',
    marginRight: 15,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#f0f2f5',
  },
  commentBottom: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 3,
    borderRadius: 5,
  },
  commentUploader: {
    display: 'flex',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    color: 'black',
    width: '100%',
    flex: 1,
  },
  likeIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
});

export default Comment;
