import React, { useContext } from 'react';
import {View, StyleSheet, Text, ScrollView, Pressable} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import CustomButton from '../../components/CustomButton';
import { AppContext } from '../../Context/AppContext';
import { LOGOUT } from '../../redux/actions';
import { useNavigation } from '@react-navigation/native';
const AccountScreen = () => {
    const dispatcher = useDispatch()
    const navigation = useNavigation()
    const { account } = useContext(AppContext)

    const logout = () => {
        dispatcher({type: LOGOUT})
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.welcome}>
                <Text style={{fontSize: 25, padding: 15, color: 'black', borderBottomWidth: 2}}>{ `${account?.user.first_name} ${account?.user.last_name}` }</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Pressable style={styles.button} onPress={()=>navigation.navigate('Edit')}>
                    <Text style={{color: 'black', fontSize: 17, fontWeight: 'bold'}}>Account Information</Text>
                </Pressable>
                <Pressable onPress={logout} style={styles.logout}>
                    <Text style={styles.text}>Logout</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FBFF'
    },
    welcome: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    logout: {
        backgroundColor: 'tomato',
        width: '50%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'white',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 10,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        marginVertical: 5,
        color: 'black'
    },
    text: {
        color: 'white'
    }
})

export default AccountScreen;
