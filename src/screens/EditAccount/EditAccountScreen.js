import React, { useState } from 'react';
import {View, StyleSheet, Text, ScrollView, ActivityIndicator} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { AwesomeTextInput } from 'react-native-awesome-text-input';
import Reinput from 'reinput'
import { ReinputButton } from "reinput"
import config from '../../config';
import axios from 'axios';
import { ACCOUNT_UPDATED } from '../../redux/actions';

const EditAccoutScreen = () => {
    const {user} = useSelector(s => s.account)
    const dispatcher = useDispatch()
    const [firstName, setFirstName] = useState(user.first_name)
    const [lastName, setLastName] = useState(user.last_name)
    const [email, setEmail] = useState(user.email)
    const [newPassword, setNewPassword] = useState(null)
    const [oldPassword, setOldPassword] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const handleSubmit = async (e) => {
        const updatedUser = {
            _id: user._id,
            first_name: firstName,
            last_name: lastName,
            email,
            role: user.role,

        }
        newPassword ? updatedUser.newPassword = newPassword : null
        oldPassword ? updatedUser.oldPassword = oldPassword : null

        let verifyPassword = false
        if(oldPassword) {
            try {
                setLoading(true)
                const res = await axios.post(config.API_SERVER+"user/compare", {email, oldPassword})
                if(res.data.same) {
                    verifyPassword = true
                    setError(false)
                } else {
                    verifyPassword = false
                    setError(true)
                }
                setLoading(false)
    
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }

        if(oldPassword && verifyPassword===false){
            console.warn('Old password wrong!');
        } else {
            try {
                setLoading(true)
                await axios.put(config.API_SERVER + 'user/users/'+user._id, updatedUser)
                setLoading(false)
                dispatcher({type: ACCOUNT_UPDATED, payload: updatedUser})
                alert('Account edited!')
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }
    }
    
    return (
        <ScrollView style={{backgroundColor: '#F5FBFF'}}>
            <KeyboardAwareScrollView style={{ flex: 1, width: '100%', padding: 10, marginTop: '10%'}}keyboardShouldPersistTaps="always">
                <Reinput onChangeText={(x) => setFirstName(x)} fontSize={20} label='First name' value={firstName} />
                <Reinput onChangeText={(x) => setLastName(x)} fontSize={20} label='Last name' value={lastName} />
                <Reinput onChangeText={(x) => setEmail(x)} fontSize={20} label='Email' value={email} />
                <Reinput error={error} onChangeText={(x) => setOldPassword(x)} fontSize={20} label='Old password' value={oldPassword} />
                <Reinput onChangeText={(x) => setNewPassword(x)} fontSize={20} label='New password' value={newPassword} />

                {/* <Reinput fontSize={20} label='New password' value={user.first_name} /> */}
                {/* <CustomInput value={user.last_name} placeholder="First Name"/>
                <CustomInput value={user.email} placeholder="First Name"/>
                <CustomInput  placeholder="New password"/> */}
                <View style={{marginTop: 25}}>
                    <ActivityIndicator animating={loading} size="large"/>
                    <CustomButton onPress={handleSubmit} text="Edit" />
                </View>
            </KeyboardAwareScrollView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({})

export default EditAccoutScreen;
