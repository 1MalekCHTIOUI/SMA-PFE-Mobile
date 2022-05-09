import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux'
import {ACCOUNT_INITIALIZE} from '../../redux/actions'
import {View, Text, Image, StyleSheet, useWindowDimensions, ActivityIndicator} from 'react-native';
import Logo from '../../assets/images/image1.jpg'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import config from '../../config'
const SigninScreen = () => {
    const {height} = useWindowDimensions()
    const dispatcher = useDispatch()
    const account = useSelector(s => s.account)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null)
    const [errors, setErrors] = useState([])
    const navigation = useNavigation()

    const handleSignin = async () => {
        try {
            setLoading(true)

            const response = await axios.post(config.API_SERVER + 'auth/signin', {
                password: password,
                email: email
            })

            if (response.data.status==="success") {
                dispatcher({
                    type: ACCOUNT_INITIALIZE,
                    payload: { isLoggedIn: true, user: response.data, token: response.data.token }
                });
                
                setStatus({success: true})
                navigation.navigate("Dashboard")
            }
            setLoading(false)

        } catch (error) {
            setLoading(false)
            setStatus({success: false})
            if(Array.isArray(error.response.data.message.errors)) {
                setErrors(error.response.data.message.errors);
            } else {
                setErrors([{msg: error.response.data.message}]);
            }
            console.log(error.response.data.message);
            
        }
    }
    return (
        <View style={styles.root} key='1'>
            <Image source={Logo} style={[styles.logo, {height: height * 0.3}]} resizeNode="contain" />
            <CustomInput placeholder='Email' value={email} setValue={setEmail} />
            <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry={true}/>
            <CustomButton text='Sign In' onPress={handleSignin} />
            <ActivityIndicator size="large" animating={loading}/>
            {
                errors.length>0 && <View key='2' style={styles.errors}>
                    {errors?.map(item => (
                        <Text>{item.msg}</Text>
                    ))}
                </View>

            }
            
        </View>
        
    );
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20
    },
    logo: {
        width: '70%',
        maxWidth:300,
        maxHeight: 200
    },
    errors: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default SigninScreen;
