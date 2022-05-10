import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {View, Image, Text, StyleSheet, ActivityIndicator} from 'react-native';
;
const DashboardScreen = () => {
    return (
        <View>
            <Text>DASHBOARD</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },

})

export default DashboardScreen;
