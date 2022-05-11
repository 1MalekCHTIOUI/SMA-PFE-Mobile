import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux'
import {ACCOUNT_INITIALIZE} from '../../redux/actions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {View, Text, Image, StyleSheet, useWindowDimensions, ActivityIndicator} from 'react-native';
import Logo from '../../assets/images/image1.jpg'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import config from '../../config'
import LinearGradient from 'react-native-linear-gradient'

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
        <View style={styles.root}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%', marginTop: '40%'}}
                keyboardShouldPersistTaps="always">
                {/* <Image source={Logo} style={[styles.logo, {height: height * 0.3}]} resizeNode="contain" /> */}
                <Text style={styles.ent}>Adiz-DATA</Text>
                <CustomInput placeholder='Email' value={email} setValue={setEmail} />
                <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry={true}/>
                <CustomButton text='Sign In' onPress={handleSignin} />
                <ActivityIndicator size="large" animating={loading}/>
                {
                    errors.length>0 && <View key='2FF' style={styles.errors}>
                        {errors?.map(item => (
                            <Text style={{color: 'white', fontSize: 14}}>{item.msg}</Text>
                        ))}
                    </View>

                }
                            
            </KeyboardAwareScrollView>
        </View>
        
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    logo: {
        width: '70%',
        maxWidth:300,
        maxHeight: 200
    },
    errors: {
        backgroundColor: 'tomato',
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ent: {
        fontSize: 30, 
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        marginBottom: 30
    }
})

export default SigninScreen;
