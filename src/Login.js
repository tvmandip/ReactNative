import React, { useEffect, useState } from 'react';
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
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import {
    LoginButton,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
    LoginManager,
} from 'react-native-fbsdk';

import {

    GoogleSigninButton,
    statusCodes,
} from '@react-native-community/google-signin';
import { GoogleSignin } from '@react-native-community/google-signin';
import Loader from './Loader';

const Login = ({ navigation }) => {

    const [email, set_email] = useState();
    const [password, set_password] = useState();
    const [cpassword, set_cpassword] = useState();
    const [Register, setRegister] = useState(false);
    const [Name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [token, setToken] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [Loadding, setLoadding] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly', 'profile', 'email'],
            webClientId: '686635314649-pes6qs7s16a5eg5n6rnlthtgb626iibe.apps.googleusercontent.com',
            offlineAccess: false,
            forceConsentPrompt: true
        });

    })


    const onsubmit = () => {
        if (password === cpassword) {
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    console.log(JSON.stringify(res))
                    database().ref('/users').
                        database()
                        .ref('/users')
                        .push({
                            name: Name,
                            email: res.user.email,
                            pic: res.user.photoURL === null ? 'https://bootdey.com/img/Content/avatar/avatar6.png' : res.user.photoURL,
                            registre_type: 'email',
                            userid: res.user.uid
                        }).then((res) => console.log('Data set.', JSON.stringify(res)));
                    console.log(Name + "  " + res.user.email + "  " + res.user.photoURL + "   " + res.user.uid)
                    alert('User account created & signed in!')
                    // clearFilds();
                    navigation.navigate('Login')
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                        alert('That email address is already in use!')
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                        alert('That email address is invalid!')
                    }
                    else {
                        alert(error)
                    }

                    console.error(error);
                });
        } else {
            alert('password must same.')
        }
    }


    const User_Login = () => {
        try {
            setLoadding(true)
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(res => {

                    AsyncStorage.setItem('email', email);
                    AsyncStorage.setItem('password', password);
                    setLoadding(false)
                    navigation.navigate('Welcome', { data: email })

                })
                .catch(error => {
                    if (error.code === 'auth/user-not-found') {
                        // console.log('That email address is invalid!');
                        alert('That User not Register !')
                        setLoadding(false)
                    } else {
                        alert(error)
                        setLoadding(false)
                    }

                    console.error(error);
                });
        } catch (error) {
            alert(error.error)
            setLoadding(false)
            console.log(error.toString(error));
        }

    }

    const Fb_Login = async () => {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        // Once signed in, get the users AccesToken
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw 'Something went wrong obtaining access token';
        }

        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        // Sign-in the user with the credential
        const F_User = await auth().signInWithCredential(facebookCredential);
        console.log(JSON.stringify(F_User))
    }

    const Google_Login = async () => {
        try {
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            // console.log('gooogle ' + JSON.stringify(googleCredential))
            // Sign-in the user with the credential
            const G_user = await auth().signInWithCredential(googleCredential)
            console.log('gooogle ' + JSON.stringify(G_user.additionalUserInfo.profile.email))

            database()
                .ref('/users')
                .orderByChild("email")
                .equalTo(G_user.additionalUserInfo.profile.email)
                .once("value")
                .then(snapshot => {
                    if (snapshot.val()) {
                        console.log("already user here")
                        console.log(snapshot.val())
                        navigation.navigate('Welcome', { data: G_user.additionalUserInfo.profile.email })
                    } else {
                        console.log("not user here")
                        console.log(snapshot.val())
                        database()
                            .ref('/users')
                            .push({
                                name: userInfo.user.name,
                                email: userInfo.user.email,
                                pic: userInfo.user.photo === null ? 'https://bootdey.com/img/Content/avatar/avatar6.png' : userInfo.user.photo,
                                registre_type: 'google',
                                userid: userInfo.user.id
                            }).then((userInfo) => console.log('Data set.', JSON.stringify(userInfo)));
                        navigation.navigate('Welcome', { data: userInfo.user.email })
                        console.log(Name + "  " + userInfo.user.email + "  " + userInfo.user.photoURL + "   " + userInfo.user.uid)
                        alert('User account created & signed in!')
                    }
                })
        } catch (error) {
            console.log(error)
        }


        // } catch (error) {
        //     console.log('Message', JSON.stringify(error));
        //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        //         alert('User Cancelled the Login Flow');
        //     } else if (error.code === statusCodes.IN_PROGRESS) {
        //         alert('Signing In');
        //     } else if (
        //         error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        //     ) {
        //         alert('Play Services Not Available or Outdated');
        //     } else {
        //         alert(error.message);
        //     }
        // };
    }

    const onLogout = () => {
        //Clear the state after logout
        setUserName(null);
        setToken(null);
        setProfilePic(null);
        console.log('Logout user')
    };
    const getResponseInfo = (error, result) => {

        if (error) {
            //Alert for the Error
            alert('Error fetching data: ' + error.toString());
        } else {
            // navigation.navigate('Welcome', { data: result })
            console.log("user info " + JSON.stringify(result.id + result.name + result.email + "pic " + result.picture.data.url));

            database()
                .ref('/users')
                .push({
                    name: result.name,
                    email: result.email,
                    pic: result.picture.data.url === null ? 'https://bootdey.com/img/Content/avatar/avatar6.png' : result.picture.data.url,
                    registre_type: 'facebook',
                    userid: result.id
                }).then((result) => console.log('Data set.', JSON.stringify(result)));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>
                Welcome
           </Text>
            {!Register ? null :
                <View style={styles.inputContainer}>
                    <AntDesign name="user" style={[styles.icon, styles.inputIcon]} size={25} />
                    {/* <Image style={[styles.icon, styles.inputIcon]} source={{ uri: 'https://png.icons8.com/envelope/androidL/40/3498db' }} /> */}
                    <TextInput style={styles.inputs}
                        placeholder="User Name"
                        underlineColorAndroid='transparent'
                        value={Name}
                        onChangeText={(Name) => { setName(Name) }}
                    />
                </View>}
            <View style={styles.inputContainer}>
                <Fontisto name="email" style={[styles.icon, styles.inputIcon]} size={25} />
                <TextInput style={styles.inputs}
                    placeholder="Email"
                    keyboardType="email-address"
                    underlineColorAndroid='transparent'
                    value={email}
                    onChangeText={(email) => { set_email(email) }}
                />
            </View>

            <View style={styles.inputContainer}>
                <AntDesign name="key" style={[styles.icon, styles.inputIcon]} size={25} />
                <TextInput style={styles.inputs}
                    placeholder="Password"
                    secureTextEntry={true}
                    underlineColorAndroid='transparent'
                    value={password}
                    onChangeText={(password) => { set_password(password) }}
                />
            </View>
            {!Register ? null :
                <View style={styles.inputContainer}>
                    <AntDesign name="key" style={[styles.icon, styles.inputIcon]} size={25} /><TextInput style={styles.inputs}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        value={cpassword}
                        onChangeText={(cpassword) => { set_cpassword(cpassword) }}
                    />
                </View>}
            <TouchableOpacity
                onPress={() => { navigation.navigate('ForgetPassword') }}
                style={styles.restoreButtonContainer}>
                <Text>forgot Password ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => { Register ? onsubmit() : User_Login(email, password) }}
                style={[styles.buttonContainer, styles.loginButton]}>
                <Text style={styles.loginText}>
                    {!Register ? 'Login' : 'SignUp'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setRegister(!Register)}
                style={styles.buttonContainer}>
                <Text>{Register ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>
            <Loader loading={Loadding}></Loader>
            <LoginButton
                readPermissions={['public_profile', 'email']}
                permissions={["email"]}
                onLoginFinished={(error, result) => {
                    if (error) {
                        alert(error);
                        console.log('Login has error: ' + result.error);
                    } else if (result.isCancelled) {
                        alert('Login is cancelled.');
                    } else {
                        AccessToken.getCurrentAccessToken().then((data) => {
                            console.log(data.accessToken.toString());
                            const processRequest = new GraphRequest(
                                '/me?fields=email,name,picture.type(large)',
                                null,
                                getResponseInfo,
                            );
                            console.log(processRequest)
                            // Start the graph request.
                            new GraphRequestManager()
                                .addRequest(processRequest).start();
                        });
                    }
                }}
                onLogoutFinished={onLogout}
            />
            <View>
                <GoogleSigninButton
                    style={{ width: 200, height: 38, top: 10 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Light}
                    onPress={() => { Google_Login() }}
                />
                {/* <TouchableOpacity onPress={() => { Google_Login() }}>
                    <View style={styles.socialButtonContent}>
                        <Image style={styles.icon} source={{ uri: 'https://png.icons8.com/google/androidL/40/FFFFFF' }} />
                        <Text style={styles.loginText}>Sign in with google</Text>
                    </View>
                </TouchableOpacity> */}

            </View>
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
    icon: {
        width: 30,
        // height: 50,
    },
    inputIcon: {
        marginLeft: 20,
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
    loginButton: {
        backgroundColor: '#3498db',
    },
    fabookButton: {
        backgroundColor: "#3b5998",
    },
    googleButton: {
        backgroundColor: "#ff0000",
    },
    loginText: {
        color: 'white',
    },
    restoreButtonContainer: {
        width: 250,
        marginBottom: 15,
        alignItems: 'flex-end'
    },
    socialButtonContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIcon: {
        color: "#FFFFFF",
        marginRight: 5
    }
});

export default Login;

