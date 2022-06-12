import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const CustomButton = ({onPress, text, posting = false}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {posting ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3B71F3',
    width: '100%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CustomButton;
