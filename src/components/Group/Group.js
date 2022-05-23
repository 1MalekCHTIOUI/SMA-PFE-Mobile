import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import config from '../../config';
import {AppContext} from '../../Context/AppContext';
// import DUMMY from '../../../public/uploads/profilePictures/camp.png'
const Group = ({group}) => {
  // const [data, setData] = useState(null);
  const [l, setL] = useState(false);
  const {userHasRoom, setCurrentChat} = useContext(AppContext);

  useEffect(() => {
    // const getGroup = async () => {
    //   try {
    //     setL(true);
    //     const res = await axios.get(
    //       config.API_SERVER + 'rooms/room/' + group._id,
    //     );
    //     setData(res.data);
    //     setL(false);
    //   } catch (error) {
    //     setL(false);
    //     console.log(error);
    //   }
    // };
    // getGroup();
    // return () => setData(null);
  }, []);

  return (
    <Pressable
      style={styles.item}
      key={group._id}
      onPress={() => setCurrentChat(group)}>
      {l ? (
        <ActivityIndicator size="large" />
      ) : (
        <View key={group._id} style={{position: 'relative'}}>
          <View>
            <Image
              resizeMode="contain"
              source={require('../../assets/images/group.png')}
              style={styles.circleborder}
            />
          </View>
          <Text style={styles.itemText}>{group?.name}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    marginLeft: 15,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
    color: 'white',
  },
  circleborder: {
    overflow: 'hidden',
    borderWidth: 2,
    width: 70,
    height: 70,
    borderRadius: 150,
    borderColor: 'white',
    tintColor: 'rgba(0,0,0,0.1)',
  },
  dot: {
    position: 'absolute',
    height: 15,
    width: 15,
    borderRadius: 50,
    top: 50,
    borderWidth: 1,
    borderColor: 'white',
    left: 50,
  },
});

export default Group;
