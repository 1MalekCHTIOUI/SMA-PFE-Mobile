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
import Video from 'react-native-video';
import likeImage from '../../assets/icons/like.png';

// import {Collapse, Grid, TextField, Typography} from '@material-ui/core';
import Comment from '../Comment/Comment';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import User1 from './../../../assets/images/users/user.svg';
const isImage = str => {
  return str.includes('.png') || str.includes('.jpg');
};
const Post = ({post, index}) => {
  const {
    account,
    emitNewLike,
    newLike,
    setNewLike,
    newUnlike,
    newComment,
    emitNewComment,
    emitNewUnlike,
  } = useContext(AppContext);
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
  const [commentFile, setCommentFile] = useState(null);
  const options = {
    title: 'Select Image',
    type: 'library',
    options: {
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    },
  };

  const handleClick = async () => {
    // hiddenFileInput.current.click();
    try {
      const images = await launchImageLibrary(options);
      setCommentFile(images);
    } catch (error) {
      console.log(error);
    }
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
      emitNewLike(account.user._id, post.userId, post._id);
    } catch (error) {
      console.log(error);
    }
  };

  const unlikePost = async () => {
    try {
      await axios.put(config.API_SERVER + 'posts/unlike/' + post._id, {
        userId: account.user._id,
      });
      emitNewUnlike(account.user._id, post.userId, post._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (newLike && post._id === newLike.postId) {
      setLike(like + 1);
    }
    if (newUnlike && post._id === newUnlike.postId) {
      setLike(like - 1);
    }
  }, [newLike, newUnlike]);
  useEffect(() => {
    if (newComment && post._id === newComment.comment.postId) {
      setComments(prev => [...prev, newComment.comment]);
    }
  }, [newComment]);
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
  useEffect(() => {
    if (commentFile) {
      console.log(commentFile);
    }
  }, [commentFile]);
  const submitComment = async () => {
    if (comment === '' && commentFile === null) return;
    const formData = new FormData();
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
    if (commentFile !== null) {
      formData.append('file', {
        uri: commentFile.assets[0].uri,
        type: commentFile.assets[0].type,
        name: commentFile.assets[0].fileName,
      });
    }
    try {
      if (commentFile !== null) {
        const imageRes = await axios.post(
          config.API_SERVER + 'upload',
          formData,
          {headers: {'Content-Type': 'multipart/form-data'}},
        );
        console.log(imageRes.data.upload);

        postedComment.attachment = [
          {
            displayName: commentFile.assets[0].fileName,
            actualName: imageRes.data.upload,
          },
        ];
      }
      try {
        console.log(postedComment);
        const res = await axios.post(
          config.API_SERVER + 'posts/comment',
          postedComment,
        );
        console.log(res.data);
        setComments(prev => [...prev, res.data]);
        emitNewComment(account.user._id, post.userId, res.data);

        setComment('');
      } catch (error) {
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    getUser();
    getPostComments();
  }, []);
  // const itemsToShow = comments
  //   ?.slice(0, numberOfitemsShown)
  //   .map(comment => <Comment comment={comment} />);
  const player = useRef();
  return (
    <View
      style={[styles.post, post.priority === true && {width: 300}]}
      key={index}>
      <View
        style={[
          styles.postWrapper,
          [post.priority === true && {backgroundColor: '#d9f4ff'}],
        ]}
        key={post._id}>
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
            {post.userId === account.user._id && (
              <Text style={{color: 'black'}}>
                {post.visibility ? 'Public' : 'Private'}
              </Text>
            )}
            {/* <MoreVert /> */}
          </View>
        </View>
        <View style={styles.postCenter}>
          <Text style={styles.postText}>{post?.content}</Text>

          {post?.attachment.length > 0 &&
            post?.attachment.map(f => (
              <View style={styles.imageContainer}>
                {isImage(f.actualName) && (
                  <Image
                    style={styles.postImg}
                    source={{uri: config.CONTENT + f.actualName}}
                    resizeMode="stretch"
                    alt="loading..."
                  />
                )}
                {f.actualName.includes('.mp4') && (
                  <Video
                    autoplay={false}
                    ref={ref => {
                      player.current = ref;
                    }}
                    source={{uri: config.VIDEO_CONTENT + f.actualName}}
                    style={styles.backgroundVideo}
                  />
                )}
                {f.actualName.includes('.pdf') && (
                  <TouchableOpacity>
                    <Text>{f.displayName}</Text>
                    <Image
                      source={require('../../assets/images/google-docs.png')}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}

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
            onPress={() => {
              setShow(!show);
              console.log('test');
            }}>
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
            <TouchableOpacity
              style={styles.commentOption}
              onPress={handleClick}>
              {/* <PermMedia htmlColor="tomato" style={styles.commentIcon} /> */}
              <Image
                source={require('../../assets/images/file.png')}
                style={{width: 30, height: 30, tintColor: 'red'}}
                resizeMode="contain"
              />

              {/* <TextInput
                type="file"
                ref={hiddenFileInput}
                onChange={onChangeFileUpload}
                style={{display: 'none'}}
              /> */}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={submitComment}
              style={styles.commentButton}>
              <Text style={{color: 'black'}}>Post</Text>
            </TouchableOpacity>
          </View>

          {commentFile && (
            <View style={{position: 'relative', width: '100%'}}>
              <Image
                source={{uri: commentFile.assets[0].uri}}
                style={{width: 50, height: 50}}
              />
              <Pressable
                style={{position: 'absolute', left: 80}}
                onPress={() => setCommentFile(null)}>
                <Image
                  source={require('../../assets/icons/cancel.png')}
                  style={{width: 20, height: 20}}
                />
              </Pressable>
            </View>
          )}

          {comments?.map((comment, index) => (
            <View key={index}>
              <Comment comment={comment} />
            </View>
          ))}
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
    padding: 10,
  },
  backgroundVideo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  postWrapper: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    elevation: 1.5,
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
    color: 'black',
  },
  postDate: {
    fontSize: 12,
    marginRight: 10,
    color: 'rgba(0,0,0,0.5)',
  },
  postCenter: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  postImg: {
    marginTop: 10,
    elevation: 1,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    maxHeight: 500,
    borderRadius: 5,
  },
  postText: {
    fontSize: 15,
    color: 'black',
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
    width: 34,
    height: 34,
    marginRight: 10,
  },
  postLikeCounter: {
    fontSize: 15,
    color: 'black',
  },
  postCommentText: {
    // borderBottom: '1px dashed gray',
    fontSize: 15,
    color: 'black',
  },
  commentInput: {
    width: '70%',
    color: 'black',
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
  },
  writeComment: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    // alignItems: 'center',
    // justifyContent: 'center',
    borderRadius: 5,
    border: '1px solid gray',
  },
  commentIcon: {
    fontSize: 18,
    marginRight: '3px',
  },
  commentOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: '100%',
  },
});

export default Post;
