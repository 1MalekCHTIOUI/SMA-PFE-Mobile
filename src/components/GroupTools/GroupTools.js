import React, {useState} from 'react';
import {
  View,
  Alert,
  Modal,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
const GroupTools = ({group}) => {
  const addGroup = () => {
    console.log(group);
  };
  const getGroupMembers = async () => {
    try {
      const members = await axios.get(
        config.API_SERVER + 'rooms/room/' + currentChat?._id,
      );
      members.data.members?.map(async m => {
        try {
          if (account.user._id !== m) {
            const member = await axios.get(
              config.API_SERVER + 'user/users/' + m,
            );
            setGroupMembers(prev => [...prev, member.data]);
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
    // getGroupMembers();
    setType('add');
    setOpenMenu(true);
  };
  const [type, setType] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const removeMember = () => {
    // getGroupMembers();
    setType('remove');
    setOpenMenu(true);
    // setGroupMembers(groupMembers.filter(m => addedMembers.includes(m._id)));
    console.log(groupMembers);
  };
  return (
    <View style={styles.container}>
      <View style={{flex: 1, backgroundColor: 'red'}}>
        <Text>Select</Text>
        <RNPickerSelect
          onValueChange={value => console.log(value)}
          placeholder="Select"
          pickerProps={{
            style: {height: '100%', width: '100%'},
          }}
          items={[
            {label: 'JavaScript', value: 'JavaScript'},
            {label: 'TypeScript', value: 'TypeScript'},
            {label: 'Python', value: 'Python'},
            {label: 'Java', value: 'Java'},
            {label: 'C++', value: 'C++'},
            {label: 'C', value: 'C'},
          ]}
        />
      </View>
      {/* <TouchableOpacity onPress={addMember}>
        <Image
          style={{height: 30, width: 30, tintColor: 'black'}}
          source={require('../../assets/icons/add.png')}
        />
      </TouchableOpacity>

      <Image
        style={{height: 15, width: 15, tintColor: 'black'}}
        source={require('../../assets/icons/cancel.png')}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={openMenu}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setOpenMenu(false);
        }}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => {
                setOpenMenu(true);
              }}>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOpenMenu(false);
              }}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,

    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GroupTools;
