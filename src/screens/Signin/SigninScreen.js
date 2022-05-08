import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux'
import {ACCOUNT_INITIALIZE} from '../../redux/actions'
import {View, Text, Image, StyleSheet, useWindowDimensions} from 'react-native';
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
    const [loading, setLoading] = useState(null)
    const [status, setStatus] = useState(null)
    const [errors, setErrors] = useState(null)
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
            setErrors({ submit: error.response.data.message });
            console.log(error)
        }
    }

    return (
        <View style={styles.root}>
            <Image source={Logo} style={[styles.logo, {height: height * 0.3}]} resizeNode="contain" />
            <CustomInput placeholder='Email' value={email} setValue={setEmail} />
            <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry={true}/>
            <CustomButton text='Sign In' onPress={handleSignin} />
            <Text>{loading ? "LOADING": null}</Text>
            <Text>{errors ? errors.submit: null}</Text>
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
    }
})

export default SigninScreen;
