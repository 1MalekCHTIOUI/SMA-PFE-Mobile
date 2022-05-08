import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const DashboardScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Hello</Text>
            <Text>Hello</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
    }
})

export default DashboardScreen;
