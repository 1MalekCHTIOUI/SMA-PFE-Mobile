import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {AwesomeTextInput} from 'react-native-awesome-text-input';
import Reinput from 'reinput';
import {ReinputButton} from 'reinput';
import config from '../../config';
import axios from 'axios';
import {ACCOUNT_UPDATED} from '../../redux/actions';
import {launchImageLibrary} from 'react-native-image-picker';
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
const EditAccoutScreen = () => {
  const {user} = useSelector(s => s.account);
  console.log(user);
  const dispatcher = useDispatch();
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [newPassword, setNewPassword] = useState(null);
  const [oldPassword, setOldPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(false);
  const [image, setImage] = useState(null);

  const handleClick = async () => {
    try {
      const images = await launchImageLibrary(options);
      if (images.didCancel) {
        setImage(null);
      } else {
        setImage(images);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async e => {
    const updatedUser = {
      _id: user._id,
      first_name: firstName,
      last_name: lastName,
      email,
      role: user.role,
      bio: bio,
    };
    newPassword ? (updatedUser.newPassword = newPassword) : null;
    oldPassword ? (updatedUser.oldPassword = oldPassword) : null;

    let verifyPassword = false;
    if (oldPassword) {
      try {
        setLoading(true);
        const res = await axios.post(config.API_SERVER + 'user/compare', {
          email,
          oldPassword,
        });
        if (res.data.same) {
          verifyPassword = true;
          setError(false);
        } else {
          verifyPassword = false;
          setError(true);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
    const formData = new FormData();
    if (image) {
      formData.append('file', {
        uri: image.assets[0].uri,
        type: image.assets[0].type,
        name: image.assets[0].fileName,
      });
      try {
        setPosting(true);
        const response = await axios.post(
          config.API_SERVER + 'upload',
          formData,
          {headers: {'Content-Type': 'multipart/form-data'}},
        );
        updatedUser.profilePicture = response.data.upload;
      } catch (error) {
        setPosting(false);
        console.log(error);
      }
    }

    if (oldPassword && verifyPassword === false) {
      console.warn('Old password wrong!');
    } else {
      try {
        setPosting(true);
        setLoading(true);
        await axios.put(
          config.API_SERVER + 'user/users/' + user._id,
          updatedUser,
        );
        setLoading(false);
        dispatcher({type: ACCOUNT_UPDATED, payload: updatedUser});
        alert('Account edited!');
      } catch (error) {
        setPosting(false);
        setLoading(false);
        console.log(error);
      }
    }
  };

  return (
    <ScrollView style={{backgroundColor: '#F5FBFF'}}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={handleClick}>
          {user.profilePicture ? (
            <Image
              source={
                image
                  ? {uri: image.assets[0].uri}
                  : {uri: config.CONTENT + user.profilePicture}
              }
              style={{width: 100, height: 100, borderRadius: 50}}
            />
          ) : (
            <Text>Upload picture</Text>
          )}
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%', padding: 10, marginTop: '10%'}}
        keyboardShouldPersistTaps="always">
        <Reinput
          onChangeText={x => setFirstName(x)}
          fontSize={20}
          label="First name"
          value={firstName}
        />
        <Reinput
          onChangeText={x => setLastName(x)}
          fontSize={20}
          label="Last name"
          value={lastName}
        />
        <Reinput
          onChangeText={x => setBio(x)}
          fontSize={20}
          label="Bio"
          value={bio}
        />
        <Reinput
          onChangeText={x => setEmail(x)}
          fontSize={20}
          label="Email"
          value={email}
        />
        <Reinput
          error={error}
          onChangeText={x => setOldPassword(x)}
          fontSize={20}
          label="Old password"
          value={oldPassword}
        />
        <Reinput
          onChangeText={x => setNewPassword(x)}
          fontSize={20}
          label="New password"
          value={newPassword}
        />

        {/* <Reinput fontSize={20} label='New password' value={user.first_name} /> */}
        {/* <CustomInput value={user.last_name} placeholder="First Name"/>
                <CustomInput value={user.email} placeholder="First Name"/>
                <CustomInput  placeholder="New password"/> */}
        <View style={{marginTop: 25}}>
          <ActivityIndicator animating={loading} size="large" />
          <CustomButton onPress={handleSubmit} text="Edit" posting={posting} />
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default EditAccoutScreen;
