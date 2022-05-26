import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';

import config from '../../config';
import {launchImageLibrary} from 'react-native-image-picker';

import {Picker} from '@react-native-picker/picker';
import {useSelector} from 'react-redux';
import axios from 'axios';

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

const Share = ({user, setPosts}) => {
  const hiddenFileInput = React.useRef(null);
  const account = useSelector(s => s.account);
  const [content, setContent] = React.useState('');
  const [announcement, setAnnouncement] = React.useState(false);
  const [postPrivacy, setPostPrivacy] = React.useState(true);
  const [commentFile, setCommentFile] = React.useState(null);

  const handleClick = async () => {
    try {
      const images = await launchImageLibrary(options);
      setCommentFile(images);
    } catch (error) {
      console.log(error);
    }
  };
  const [selectedFiles, setSelectedFiles] = React.useState([]);

  const onChangeFileUpload = e => {
    setSelectedFiles(prev => [...prev, e.target.files[0]]);
  };
  const removeItem = val => {
    setSelectedFiles(prev => prev.filter(item => item.name !== val));
  };
  const handleChange = e => {
    setContent(e.target.value);
  };
  const submitPost = async () => {
    const formData = new FormData();
    if (content === '' && commentFile === null) return;

    const post = {
      userId: account.user._id,
      visibility: postPrivacy,
      priority: announcement,
    };
    if (content !== '') {
      post.content = content;
    }
    if (commentFile !== null) {
      formData.append('file', {
        uri: commentFile.assets[0].uri,
        type: commentFile.assets[0].type,
        name: commentFile.assets[0].fileName,
      });
    }

    console.log(post);

    try {
      try {
        if (commentFile !== null) {
          const response = await axios.post(
            config.API_SERVER + 'upload',
            formData,
            {headers: {'Content-Type': 'multipart/form-data'}},
          );
          post.attachment = [
            {
              displayName: commentFile.assets[0].fileName,
              actualName: response.data.upload,
            },
          ];
          console.log(message.attachment);
        }
      } catch (error) {
        console.log(error);
      }
      const res = await axios.post(config.API_SERVER + 'posts', post);
      setPosts(prev => [...prev, res.data]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.share}>
      <View style={styles.shareWrapper}>
        <View className="sharePrivacy">
          <Picker
            style={styles.picker}
            selectedValue={postPrivacy}
            onValueChange={(itemValue, itemIndex) => setPostPrivacy(itemValue)}>
            <Picker.Item label="Public" value={true} />
            <Picker.Item label="Private" value={false} />
          </Picker>
          {user.role !== 'USER' && (
            <Picker
              style={styles.picker}
              selectedValue={announcement}
              onValueChange={(itemValue, itemIndex) =>
                setAnnouncement(itemValue)
              }>
              <Picker.Item
                tyle={{color: 'black'}}
                label="Normal Post"
                value={false}
              />
              <Picker.Item label="Announcement" value={true} />
            </Picker>
          )}
        </View>

        <View className="shareTop">
          <Image
            className="shareProfileImg"
            source={
              user.profilePicture
                ? {uri: config.HOST + `public/uploads/${user.profilePicture}`}
                : require('../../assets/images/user.png')
            }
            alt=""
          />
          <TextInput
            placeholder={`What's in your mind ${user.first_name}?`}
            value={content}
            onChange={handleChange}
            className="shareInput"
          />
        </View>

        {/* <View className="shareMiddle">
          <ImageList sx={{width: '100%'}} rowHeight={164} cols={3}>
            {selectedFiles?.map((item, i) => {
              return (
                <ImageListItem key={i}>
                  {(item.name.includes('.png') ||
                    item.name.includes('.jpg')) && (
                    <View className="uploadedImageContainer">
                      <Close
                        className="close"
                        onClick={() => removeItem(item.name)}
                      />
                      <img
                        className="uploadedImage"
                        src={`${URL.createObjectURL(item)}`}
                      />
                    </View>
                  )}
                </ImageListItem>
              );
            })}
          </ImageList>
        </View> */}
        {/* <hr className="shareHr" /> */}
        <View style={styles.shareBottom}>
          <View style={styles.shareOptions}>
            <TouchableOpacity text="send" onPress={handleClick}>
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
          <Pressable style={styles.shareButton} onClick={submitPost}>
            <Text>Share</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Share;

const styles = StyleSheet.create({
  share: {
    flex: 1,
  },
  shareWrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  shareButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  shareBottom: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pickerItem: {
    color: 'black',
  },
});
