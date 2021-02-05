import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';

import auth, { firebase } from '@react-native-firebase/auth'

const ForgetPassword = ({ navigation }) => {
    const [email, set_email] = useState();

    const forgotPassword = () => {
        console.log(email)
        auth().sendPasswordResetEmail(email)
            .then(function (user) {
                alert('Please check your email...')
                navigation.goBack()

            }).catch(function (e) {
                console.log(e)
            })
    }

    return (

        <View style={styles.container}>
            <Text style={styles.titleText}>
                Forget Password ?
                </Text>
            <View style={styles.inputContainer}>
                <TextInput style={styles.inputs}
                    placeholder="Email"
                    keyboardType="email-address"
                    underlineColorAndroid='transparent'
                    value={email}
                    onChangeText={(txt) => { set_email(email) }}
                />
            </View>
            <TouchableOpacity
                onPress={() => { forgotPassword() }}
                style={[styles.buttonContainer, styles.loginButton]}>
                <Text style={styles.loginText}>
                    {'Send Email'}
                </Text>
            </TouchableOpacity>
        </View >

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B0E0E6',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
        color: '#FFF'
    },

    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 250,
        height: 45,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    loginButton: {
        backgroundColor: '#3498db',
    },
    icon: {
        width: 30,
        height: 30,
    },
    inputIcon: {
        marginLeft: 15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
    },
    loginText: {
        color: 'white',
    },
    restoreButtonContainer: {
        width: 250,
        marginBottom: 15,
        alignItems: 'flex-end'
    },

});

export default ForgetPassword;