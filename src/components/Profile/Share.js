import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import config from '../../config';
import {launchImageLibrary} from 'react-native-image-picker';

import {Picker} from '@react-native-picker/picker';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {AppContext} from '../../Context/AppContext';

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
const options2 = {
  title: 'Select video',
  mediaType: 'video',
  path: 'video',
  quality: 1,
};
const Divider = () => {
  return (
    <View
      style={{
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
      }}>
      <View
        style={{
          height: 2,
          backgroundColor: 'rgba(0,0,0,0.1)',
          //   elevation: 1,
          width: '80%',
          borderRadius: 10,
        }}
      />
    </View>
  );
};
const Share = ({user, setPosts}) => {
  const hiddenFileInput = React.useRef(null);

  const {account, emitNewPost} = React.useContext(AppContext);
  const [content, setContent] = React.useState('');
  const [announcement, setAnnouncement] = React.useState(false);
  const [postPrivacy, setPostPrivacy] = React.useState(true);
  const [postFile, setPostFile] = React.useState(null);
  const [reader, setReader] = React.useState([]);

  const handleClick = async type => {
    try {
      console.log(type);
      const images = await launchImageLibrary(
        type === 'video' ? options2 : options,
      );
      if (images.didCancel) {
        setPostFile(null);
      } else {
        setPostFile(images);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // const [selectedFiles, setSelectedFiles] = React.useState([]);

  // const onChangeFileUpload = e => {
  //   setSelectedFiles(prev => [...prev, e.target.files[0]]);
  // };
  const removeItem = () => {
    // setSelectedFiles(prev => prev.filter(item => item.name !== val));
    setPostFile(null);
  };

  const [posting, setPosting] = React.useState(false);
  const submitPost = async () => {
    if (content === '' && postFile === null) return;
    const formData = new FormData();
    setPosting(true);
    const post = {
      userId: account.user._id,
      visibility: postPrivacy,
      priority: announcement,
    };
    if (content !== '') {
      post.content = content;
    }
    if (postFile !== null) {
      console.log(postFile);
      if (postFile.assets[0].type.includes('video/mp4')) {
        const name = postFile.assets[0].fileName + '.mp4';
        formData.append('file', {
          uri: postFile.assets[0].uri,
          type: postFile.assets[0].type,
          name: name,
        });
      } else {
        formData.append('file', {
          uri: postFile.assets[0].uri,
          type: postFile.assets[0].type,
          name: postFile.assets[0].fileName,
        });
      }
    }

    try {
      if (postFile !== null) {
        const response = await axios.post(
          config.API_SERVER + 'upload',
          formData,
          {headers: {'Content-Type': 'multipart/form-data'}},
        );
        post.attachment = [
          {
            displayName: postFile.assets[0].fileName,
            actualName: response.data.upload,
          },
        ];
      }
      console.log(post);
      try {
        console.log(post);
        const res = await axios.post(config.API_SERVER + 'posts', post);
        if (res.data.privacy === false)
          emitNewPost(account.user._id, post.priority);
        setPosts(prev => [...prev, res.data]);
        setPosting(false);
        setPostFile(null);
      } catch (error) {
        setPosting(false);
        console.log(error.message);
      }
    } catch (error) {
      setPosting(false);
      console.log(error);
    }
  };
  return (
    <View style={styles.share}>
      <View style={styles.shareWrapper}>
        <View style={styles.pickerWrapper}>
          {announcement === false && (
            <View style={styles.picker}>
              <Picker
                selectedValue={postPrivacy}
                onValueChange={(itemValue, itemIndex) =>
                  setPostPrivacy(itemValue)
                }>
                <Picker.Item
                  style={{color: 'black'}}
                  label="Public"
                  value={true}
                />
                <Picker.Item
                  style={{color: 'black'}}
                  label="Private"
                  value={false}
                />
              </Picker>
            </View>
          )}

          <View style={styles.picker}>
            {user.role[0] !== 'USER' && (
              <Picker
                selectedValue={announcement}
                onValueChange={(itemValue, itemIndex) =>
                  setAnnouncement(itemValue)
                }>
                <Picker.Item
                  style={{color: 'black'}}
                  label="Post"
                  value={false}
                />
                <Picker.Item
                  style={{color: 'black'}}
                  label="Announcement"
                  value={true}
                />
              </Picker>
            )}
          </View>
        </View>
        <Divider />
        <View style={styles.shareTop}>
          <Image
            style={styles.shareProfileImg}
            resizeMode="contain"
            source={
              user.profilePicture
                ? {uri: config.CONTENT + user.profilePicture}
                : require('../../assets/images/user.png')
            }
            alt=""
          />
          <TextInput
            placeholder={`What's in your mind ${user.first_name}?`}
            value={content}
            placeholderTextColor="rgba(0,0,0,0.4)"
            onChangeText={setContent}
            style={styles.shareInput}
          />
        </View>
        <Divider />

        {postFile && (
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              position: 'relative',
            }}>
            {postFile?.assets[0].fileName.includes('.png') ||
              (postFile?.assets[0].fileName.includes('.jpg') && (
                <Image
                  source={{uri: postFile?.assets[0].uri}}
                  resizeMode="stretch"
                  style={{width: 100, height: 100, borderRadius: 3}}
                />
              ))}
            {postFile?.assets[0].fileName.includes('.mp4') && (
              <Video
                source={{uri: postFile?.assets[0].uri}}
                resizeMode="stretch"
                style={styles.backgroundVideo}
              />
            )}
            <Pressable
              style={{position: 'absolute', left: 80}}
              onPress={removeItem}>
              <Image
                source={require('../../assets/icons/cancel.png')}
                style={{width: 20, height: 20}}
              />
            </Pressable>
          </View>
        )}

        {/* <hr className="shareHr" /> */}
        <View style={styles.shareBottom}>
          <View style={styles.shareOptions}>
            <TouchableOpacity text="send" onPress={() => handleClick('image')}>
              <Image
                style={{
                  height: 30,
                  width: 30,
                  marginLeft: 10,
                  marginVertical: 20,
                }}
                source={require('../../assets/images/picture.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* <View className="shareOption">
              <Text htmlColor="blue" className="shareIcon" />
              <Text className="shareOptionText">Tag</Text>
            </View>
            <View className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </View>
            <View className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </View> */}
          </View>
          <TouchableOpacity text="send" onPress={() => handleClick('video')}>
            <Image
              style={{
                height: 30,
                width: 30,
                marginLeft: 10,
                marginVertical: 20,
              }}
              source={require('../../assets/icons/video-camera-filled.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={posting}
            style={styles.shareButton}
            onPress={submitPost}>
            {posting ? (
              <ActivityIndicator animating={posting} />
            ) : (
              <Text style={{color: 'white'}}>Share</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Share;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  share: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareWrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    elevation: 1.5,
    // backgroundColor: 'red',
    width: '94%',
  },
  shareButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 40,
    backgroundColor: '#ff004e',
    borderRadius: 5,
  },
  shareBottom: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  pickerItem: {
    color: 'black',
  },
  picker: {
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'orange',
    width: '45%',
    height: 40,
    borderRadius: 5,
  },
  pickerWrapper: {
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  shareProfileImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'black',
  },

  shareInput: {
    width: '65%',
    color: 'black',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
  },
  shareTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
