import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, FlatList
} from 'react-native';
import database from '@react-native-firebase/database'
import { GoogleSignin } from '@react-native-community/google-signin';
import Loader from './Loader';
import AntDesign from 'react-native-vector-icons/AntDesign'
import UserList from './UserList';


Welcome = ({ route, navigation }) => {
    const { data } = route.params;
    const [Loading, setLoading] = useState(false)
    const [User, setUser] = useState()
    const [userLists, setUserList] = useState();
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
    useEffect(() => {
        {
            !User ? UserData() : null
        }
        {
            !userLists ? UsersData() : null
        }
        // console.log(User[0].id)

    })
    const UserData = () => {
        database()
            .ref('/users')
            .orderByChild("email")
            .equalTo(data)
            .once("value")
            .then(snapshot => {
                if (snapshot.val()) {
                    // console.log("no")

                    var li = []
                    snapshot.forEach((child) => {
                        li.push({
                            key: child.key,
                            name: child.val().name,
                            pic: child.val().pic,
                            email: child.val().email,
                            id: child.val().userid,
                        })
                    })

                    console.log(li[0].name)
                    setUser(li)

                } else {
                    // console.log("yes")
                    console.log(JSON.stringify(snapshot.val()))

                }
            })
    }
    const UsersData = () => {
        database().ref('/users').on('value', (snapshot) => {
            var li = []
            snapshot.forEach((child) => {
                li.push({
                    key: child.key,
                    name: child.val().name,
                    pic: child.val().pic,
                    email: child.val().email,
                    id: child.val().userid
                })
                setUserList(li)
            })
        })
    }

    const renderSeparator = () => (
        <View
            style={{
                backgroundColor: 'black',
                height: 0.5,
            }}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {User != null ?
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Image
                                style={styles.avatar}
                                source={{ uri: User[0].pic }}
                            />
                        </View>
                        <View style={{ justifyContent: 'center', left: '50%', left: 120, top: 40 }}>
                            <Text style={styles.name}>{User[0].name}</Text>
                            <Text style={styles.description}>{User[0].email}</Text>
                        </View>
                        <AntDesign
                            name="logout" size={30} color={"#FFF"}
                            style={{ position: 'absolute', right: 20, top: 50 }}
                        />
                    </View>
                    : null}
            </View>

            <View style={styles.body}>
                <FlatList
                    data={userLists}
                    keyExtractor={(item) => {
                        return item.id;
                    }}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                <View style={{ padding: 5 }}>
                                    <Image
                                        style={{ height: 50, width: 50, borderRadius: 50, }}
                                        source={{ uri: item.pic }}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Chat', { rid: item.id, sid: User[0].id, name: User[0].name }) }}
                                    style={{ padding: 5 }}
                                >
                                    <Text style={{ fontSize: 15 }}>{item.name}</Text>
                                    <Text style={{ width: '100%', fontSize: 12 }}>{item.email}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                    ItemSeparatorComponent={renderSeparator}
                />
            </View>
            <Loader loading={Loading}></Loader>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#00BFFF",
        height: 120,
    },
    avatar: {
        width: 85,
        height: 85,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        left: 15,
        alignSelf: 'flex-start',
        position: 'absolute',
        marginTop: 20
    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: '600',
    },
    body: {
        marginTop: 10,
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