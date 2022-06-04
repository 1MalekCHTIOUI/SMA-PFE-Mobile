import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Alert,
  Modal,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import {AppContext} from '../../Context/AppContext';
import config from '../../config';
import CustomButton from '../CustomButton';
import {useNavigation} from '@react-navigation/native';
const Divider = () => {
  return (
    <View
      style={{
        width: 2,
        height: '100%',
        backgroundColor: 'white',
        padding: 0,
        margin: 0,
      }}
    />
  );
};
const GroupTools = ({group}) => {
  const {
    account,
    submitAddMember,
    submitRemoveMember,
    removeGroup,
    removeMessagesFromRoom,
    setIsChanged,
    exitGroup,
  } = useContext(AppContext);
  const [type, setType] = useState('');
  const [status, setStatus] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const navigation = useNavigation();
  const getUsers = async () => {
    try {
      const u = await axios.get(config.API_SERVER + 'user/users');
      setUsers(u.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getGroupMembers = async () => {
    if (group === null) return;
    try {
      const members = await axios.get(
        config.API_SERVER + 'rooms/room/' + group._id,
      );
      members.data.members?.map(async m => {
        try {
          if (
            account.user._id !== m.userId &&
            groupMembers.some(u => u._id !== m.userId)
          ) {
            const member = await axios.get(
              config.API_SERVER + 'user/users/' + m,
            );

            setGroupMembers(
              prev => prev._id !== member.data._id && [...prev, member.data],
            );
          }
        } catch (e) {
          console.log(e);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const addMember = () => {
    getUsers();
    getGroupMembers();
    setType('add');
    setOpenMenu(true);
  };

  const removeMember = () => {
    getGroupMembers();
    setType('remove');
    setOpenMenu(true);
    setStatus(1);
    console.log(users);
    // setGroupMembers(groupMembers.filter(m => selectedUser.includes(m._id)));
  };
  const handleExitGroup = () => {
    // removeGroup(group)
    Alert.alert('Please confirm', `Are you sure you leave ${group.name}`, [
      {
        text: 'Cancel',
        onPress: () => console.log('cancel'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          exitGroup(group, account.user);
          navigation.navigate('Chats');
        },
      },
    ]);
  };
  const handleRemoveGroup = () => {
    // removeGroup(group)
    Alert.alert(
      'Please confirm',
      `Are you sure you want to delete ${group.name}`,
      [
        {
          text: 'Cancel',
          onPress: () => setSelectedUser(null),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            submitRemoveGroup(group);
            navigation.navigate('Chats');
          },
        },
      ],
    );
    // setStatus(1);
    // console.log(users);
    // setGroupMembers(groupMembers.filter(m => selectedUser.includes(m._id)));
  };
  const clean = () => {
    setStatus(0);
    setSelectedUser(null);
    setType('');
    setOpenMenu(false);
  };
  const submitRemoveGroup = async () => {
    try {
      const temp = group;
      try {
        await axios.delete(
          config.API_SERVER + `rooms/removeGroup/${group?._id}`,
        );
        setIsChanged(true);
      } catch (error) {
        console.log(error);
      }
      removeGroup(temp);
      setStatus(1);
      removeMessagesFromRoom(temp._id);
      // window.location.reload(false)
    } catch (error) {
      console.log(error);
    }
  };
  const handleConfirm = () => {
    if (selectedUser && type === 'add') {
      submitAddMember(group, selectedUser);
      setCurrentChat(null);
      getGroupMembers();
    }
    if (selectedUser && type === 'remove') {
      Alert.alert(
        'Please confirm',
        `Are you sure you want to delete ${selectedUser.first_name} from ${group.name}`,
        [
          {
            text: 'Cancel',
            onPress: () => setSelectedUser(null),
            style: 'cancel',
          },
          // type==='remove' && submitRemoveMember(group, selectedUser)
          {
            text: 'OK',
            onPress: () => {
              if (selectedUser) {
                submitRemoveMember(group, selectedUser);
                getGroupMembers();
              }
            },
          },
        ],
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.items}>
        {account.user?.role[0] !== 'USER' && (
          <TouchableOpacity onPress={addMember} style={styles.pressable}>
            <Image
              style={{height: 30, width: 30, tintColor: '#ff3f5b'}}
              source={require('../../assets/icons/add.png')}
            />
          </TouchableOpacity>
        )}

        {account.user?.role[0] !== 'USER' && <Divider />}

        {account.user?.role[0] !== 'USER' && (
          <TouchableOpacity
            onPress={handleRemoveGroup}
            style={styles.pressable}>
            <Image
              style={{height: 30, width: 30}}
              source={require('../../assets/images/trash-bin.png')}
            />
          </TouchableOpacity>
        )}
        {account.user?.role[0] !== 'USER' && <Divider />}
        {account.user?.role[0] !== 'USER' && (
          <TouchableOpacity onPress={removeMember} style={styles.pressable}>
            <Image
              style={{
                height: 15,
                width: 15,
                tintColor: '#ff3f5b',
              }}
              source={require('../../assets/icons/cancel.png')}
            />
          </TouchableOpacity>
        )}
        {account.user?.role[0] !== 'USER' && <Divider />}

        <TouchableOpacity onPress={handleExitGroup} style={styles.pressable}>
          <Image
            style={{
              height: 30,
              width: 30,
              tintColor: '#ff3f5b',
            }}
            source={require('../../assets/icons/backspace.png')}
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={openMenu}
        onRequestClose={() => {
          setOpenMenu(false);
        }}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.headerText}>
              Choose user to {type === 'add' && 'add'}{' '}
              {type === 'remove' && 'remove'}
            </Text>
            <Text style={styles.headerText}>
              {status === 1 &&
                type === 'remove' &&
                'User successfully removed!'}
              {status === 1 && type === 'add' && 'User successfully added!'}
            </Text>
            <Picker
              style={styles.picker}
              selectedValue={selectedUser}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedUser(itemValue)
              }>
              {type === 'add' &&
                users
                  ?.filter(
                    user =>
                      user._id !== account.user._id &&
                      groupMembers.includes(user._id) === false,
                  )
                  .map(item => {
                    // if (groupMembers.some(m => m._id !== item._id)) {
                    return (
                      <Picker.Item
                        label={item.first_name + ' ' + item.last_name}
                        value={item}
                      />
                    );
                    // }
                  })}
              {type === 'remove' &&
                groupMembers
                  .filter(u => u._id !== account.user._id)
                  .map(item => (
                    <Picker.Item
                      label={item.first_name + ' ' + item.last_name}
                      value={item}
                    />
                  ))}
            </Picker>
            {selectedUser && (
              <View style={{width: 200}}>
                <CustomButton text="Confirm" onPress={handleConfirm} />
              </View>
            )}
            <TouchableOpacity
              onPress={() => {
                setOpenMenu(true);
              }}></TouchableOpacity>
            <TouchableOpacity onPress={clean}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 15,
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  items: {
    padding: 15,
    flex: 1,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.07)',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    height: 50,
    flexDirection: 'column',
    // backgroundColor: 'white',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '50%',
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '',
    borderWidth: 1,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '70%',
    backgroundColor: 'white',
    color: 'white',
    textAlign: 'center',
    borderRadius: 10,
  },
  headerText: {
    fontSize: 20,
    padding: 10,
    color: 'black',
  },
  pressable: {
    // backgroundColor: 'red',
  },
});

export default GroupTools;
