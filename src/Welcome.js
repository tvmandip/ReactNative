import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import { GoogleSignin } from '@react-native-community/google-signin';
Welcome = ({ route, navigation }) => {
    const { data } = route.params;

    const Logout = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();

        } catch (error) {
            console.error(error);
        }
        navigation.navigate('Login')
        // setGettingLoginStatus(false);
    }
    console.log(JSON.stringify(data.user.uid))
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={{
                        width: 100,
                        height: 40,
                        justifyContent: 'center',
                        alignSelf: 'flex-end',
                        backgroundColor: 'blue',
                        alignContent: 'center'
                    }}
                    onPress={() => { Logout() }}
                >
                    <Text style={{ color: '#FFF', textAlign: 'center' }}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
            <Image
                style={styles.avatar}
                source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
            />
            {/* <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <Text style={styles.name}>{data.user.email}</Text>
                    <Text style={styles.info}>{data.user.uid}</Text>
                    <Text style={styles.description}>
                        {data.user.metadata.lastSignInTime}
                    </Text>

                    <TouchableOpacity
                        style={styles.buttonContainer}>
                        <Text>Opcion 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonContainer}>
                        <Text>Opcion 2</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#00BFFF",
        height: 200,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 130
    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: '600',
    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    },
    info: {
        fontSize: 16,
        color: "#00BFFF",
        marginTop: 10
    },
    description: {
        fontSize: 16,
        color: "#696969",
        marginTop: 10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
        backgroundColor: "#00BFFF",
    },
});

export default Welcome;