import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';

const CustomInput = ({value, setValue, placeholder, secureTextEntry}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="rgba(0,0,0,0.3)"
        style={styles.input}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    background: 'white',

    width: '100%',
    boderColor: '#e8e8e8',
    borderWidth: 0.6,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {
    color: 'black',
  },
});

export default CustomInput;
