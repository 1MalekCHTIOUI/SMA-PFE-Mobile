// import {MoreVert, PermMedia} from '@material-ui/icons';
import React from 'react';
import {useState, useEffect, useRef, useContext} from 'react';
import axios from 'axios';
import config from '../../config';
import {format} from 'timeago.js';
import {AppContext} from '../../Context/AppContext';
import {
  View,
  ScrollView,
  Image,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import likeImage from '../../assets/icons/like.png';

// import {Collapse, Grid, TextField, Typography} from '@material-ui/core';
// import Comment from '../Comment/Comment';
// import User1 from './../../../assets/images/users/user.svg';
const Post = ({post, index}) => {
  const {account} = useContext(AppContext);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(
    post.likes.some(u => u.userId === account?.user._id),
  );

  const [user, setUser] = useState({});
  const [numberOfitemsShown, setNumberOfitemsShown] = useState(3);

  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState('');
  const [show, setShow] = useState(false);
  const hiddenFileInput = useRef(null);
  const [content, setContent] = useState('');

  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onChangeFileUpload = e => {
    setSelectedFiles(prev => [...prev, e.target.files[0]]);
  };
  const removeItem = val => {
    setSelectedFiles(prev => prev.filter(item => item.name !== val));
  };
  const handleChange = e => {
    setContent(e.target.value);
  };
  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    isLiked ? unlikePost() : likePost();
    setIsLiked(!isLiked);
  };

  const likePost = async () => {
    try {
      await axios.put(config.API_SERVER + 'posts/like/' + post._id, {
        userId: account.user._id,
        username: `${user.first_name} ${user.last_name}`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const unlikePost = async () => {
    try {
      await axios.put(config.API_SERVER + 'posts/unlike/' + post._id, {
        userId: account.user._id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //     if (isLiked) {
  //         likePost();
  //     } else {
  //         unlikePost();
  //     }
  // }, [isLiked]);

  const showMore = () => {
    if (numberOfitemsShown + 3 <= comments.length) {
      setNumberOfitemsShown(numberOfitemsShown + 3);
    }
  };
  const showLess = () => {
    setNumberOfitemsShown(numberOfitemsShown - 3);
  };
  const getUser = async () => {
    try {
      const fetchUser = await axios.get(
        config.API_SERVER + 'user/users/' + post.userId,
      );
      console.log(fetchUser.data.first_name);
      setUser(fetchUser.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getPostComments = async () => {
    try {
      const fetchComments = await axios.get(
        config.API_SERVER + 'posts/comment/' + post._id,
      );
      setComments(fetchComments.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const submitComment = async () => {
    if (comment === '' && selectedFiles.length === 0) return;
    const postedComment = {
      postId: post._id,
      content: comment,
      uploadedBy: {
        userId: account.user._id,
        username: account.user.first_name + ' ' + account.user.last_name,
      },
    };
    if (content !== '') {
      postedComment.content = content;
    }
    if (selectedFiles.length > 0) {
      postedComment.selectedFiles = selectedFiles;
    }

    try {
      const res = await axios.post(
        config.API_SERVER + 'posts/comment',
        postedComment,
      );
      setComments(prev => [...prev, res.data]);
      setComment('');
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUser();
    getPostComments();
  }, []);
  // const itemsToShow = comments
  //   ?.slice(0, numberOfitemsShown)
  //   .map(comment => <Comment comment={comment} />);
  return (
    <View style={styles.post} key={index}>
      <View style={styles.postWrapper} key={post._id}>
        <View style={styles.postTop}>
          <View style={styles.postTopLeft}>
            <Image
              style={styles.postProfileImg}
              resizeMode="contain"
              source={
                user._id === post.userId && user.profilePicture
                  ? {
                      uri: config.CONTENT + user.profilePicture,
                    }
                  : require('../../assets/images/user.png')
              }
            />
            <View style={styles.postTopLeftRight}>
              <Text style={styles.postUsername}>
                {user._id === post.userId &&
                  user.first_name + ' ' + user.last_name}
              </Text>
              <Text style={styles.postDate}>{format(post.createdAt)}</Text>
            </View>
          </View>
          <View style={styles.postTopRight}>
            <Text>{post.visibility ? 'Public' : 'Private'}</Text>
            {/* <MoreVert /> */}
          </View>
        </View>
        <View style={styles.postCenter}>
          <Text style={styles.postText}>{post?.content}</Text>
          {/* {post?.attachment.length > 0 && (
            <Grid container xs={12}>
              {post?.attachment.map(f => (
                <Grid item xs={12} justifyContent="center" alignItems="center">
                  <ImageonClick
                    style={styles.postImg}
                    src={`/uploads/files/${f.actualName}`}
                    alt="loading..."
                  />
                </Grid>
              ))}
            </Grid>
          )} */}

          {/* <Image style={styles.postImg} source={post?.photo} alt="" /> */}
        </View>
        <View style={styles.postBottom}>
          <View style={styles.postBottomLeft}>
            <TouchableOpacity onPress={likeHandler}>
              <Image
                style={styles.likeIcon}
                source={likeImage}
                alt=""
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Text style={styles.postLikeCounter}>
              {isLiked ? 'You and ' + `${like - 1} people like it` : ''}
              {!isLiked && `${like} people like it`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.postBottomRight}
            onPress={() => setShow(!show)}>
            <Text style={styles.postCommentText}>
              {comments?.length} comments
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {show && (
        <View style={styles.commentsContainer}>
          <View style={styles.writeComment}>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              fullWidth
              placeholder="Write comment"
            />
            {/* <View style={styles.commentOption} onPress={handleClick}>
              <PermMedia htmlColor="tomato" style={styles.commentIcon} />
              <Text style={styles.commentOptionText}>Photo or Video</Text>
              <TextInput
                type="file"
                ref={hiddenFileInput}
                onChange={onChangeFileUpload}
                style={{display: 'none'}}
              />
            </View> */}
            <TouchableOpacity
              onPress={submitComment}
              style={styles.commentButton}>
              <Text style={{color: 'white'}}>Post</Text>
            </TouchableOpacity>
          </View>
          {/* {comments.map(comment => (
            <Comment comment={comment} />
          ))} */}
          {/* {itemsToShow ? itemsToShow : <Text>Loading...</Text>} */}
          {/* {comments?.length > 0 && comments?.length !== itemsToShow?.length ? (
            <TouchableOpacity
              style={{cursor: 'pointer', textAlign: 'center'}}
              onPress={showMore}>
              <Text>Show more</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{cursor: 'pointer', textAlign: 'center'}}
              onPress={showLess}>
              <Text>Show less</Text>
            </TouchableOpacity>
          )} */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    width: '100%',

    // boxShadow: '0px 0px 16px -8px rgba(0, 0, 0, 0.68)',
    padding: 20,
  },
  postWrapper: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',

    // elevation: 0.2,
    // backgroundColor: 'tomato',
    padding: 5,
  },
  postTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postTopLeft: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  postTopRight: {
    display: 'flex',
    alignItems: 'center',
  },
  postTopLeftRight: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 5,
    /* alignItems: center, */
  },
  postProfileImg: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },
  postUsername: {
    fontSize: 15,
    fontWeight: '500',
    marginRight: 10,
  },
  postDate: {
    fontSize: 12,
    marginRight: 10,
  },
  postCenter: {
    marginTop: 10,
    marginBottom: 10,
  },
  postImg: {
    marginTop: 20,
    width: '100%',
    maxHeight: 500,
  },
  postText: {
    fontSize: 15,
  },
  postBottom: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postBottomLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  postLikeCounter: {
    fontSize: 15,
  },
  postCommentText: {
    // borderBottom: '1px dashed gray',
    fontSize: 15,
  },
  commentInput: {
    width: '80%',
    padding: 5,
  },
  writeComment: {
    display: 'flex',
    // alignItems: 'center',
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    padding: 5,
    justifyContent: 'space-between',
  },
  commentButton: {
    padding: 7,
    borderRadius: 5,
    backgroundColor: 'green',
    fontWeight: '500',
    marginRight: 20,
    color: 'white',
  },
  commentOption: {
    padding: 7,
    display: 'flex',
    borderRadius: 5,
    alignItems: 'center',
    borderRadius: 5,
    border: '1px solid gray',
  },
  commentIcon: {
    fontSize: 18,
    marginRight: '3px',
  },
  commentOptionText: {
    fontSize: '14px',
    fontWeight: 500,
  },
});

export default Post;
